import { SQSHandler } from "aws-lambda";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { DynamoDAOFactory } from "../../dao/factory/DynamoDAOFactory";

const sqs = new SQSClient({ region: "us-east-1" });
const factory = new DynamoDAOFactory();

type FanoutMessage = {
  statusOwnerAlias: string;
  postId: string;
  timestamp: number;
  content: string;
  urls?: string[];
  mentions?: string[];
  lastFollowerAlias?: string;
};

const PAGE_SIZE = 25;

export const handler: SQSHandler = async (event) => {
  const followDAO = factory.getFollowDAO();

  const feedQueueUrl = process.env.FEED_QUEUE_URL;
  const postStatusQueueUrl = process.env.POST_STATUS_QUEUE_URL;

  if (!feedQueueUrl) {
    throw new Error("FEED_QUEUE_URL environment variable is not set");
  }

  if (!postStatusQueueUrl) {
    throw new Error("POST_STATUS_QUEUE_URL environment variable is not set");
  }

  console.log("FANOUT_EVENT_RECORD_COUNT", event.Records.length);

  for (const record of event.Records) {
    const message = JSON.parse(record.body) as FanoutMessage;

    const statusOwnerAlias = message.statusOwnerAlias;
    const postId = message.postId;
    const timestamp = message.timestamp;
    const content = message.content;
    const urls = message.urls ?? [];
    const mentions = message.mentions ?? [];
    const lastFollowerAlias = message.lastFollowerAlias;

    console.log("FANOUT_MESSAGE", {
      statusOwnerAlias,
      postId,
      timestamp,
      content,
      lastFollowerAlias,
    });

    const result = await followDAO.getFollowers(
      statusOwnerAlias,
      PAGE_SIZE,
      lastFollowerAlias
    );

    const followers = result.values;

    console.log("FANOUT_PAGE_RESULT", {
      statusOwnerAlias,
      followersFoundThisPage: followers.length,
      followerAliases: followers.map((f) => f.followerAlias),
      hasMorePages: result.hasMorePages,
      lastFollowerAliasBeforeUpdate: lastFollowerAlias,
    });

    if (followers.length > 0) {
      await sqs.send(
        new SendMessageCommand({
          QueueUrl: feedQueueUrl,
          MessageBody: JSON.stringify({
            statusOwnerAlias,
            postId,
            timestamp,
            content,
            urls,
            mentions,
            followers: followers.map((f) => f.followerAlias),
          }),
        })
      );

      console.log("FANOUT_SENT_TO_FEED_QUEUE", {
        statusOwnerAlias,
        sentFollowerAliases: followers.map((f) => f.followerAlias),
      });
    }

    if (result.hasMorePages && followers.length > 0) {
      const nextLastFollowerAlias =
        followers[followers.length - 1].followerAlias;

      await sqs.send(
        new SendMessageCommand({
          QueueUrl: postStatusQueueUrl,
          MessageBody: JSON.stringify({
            statusOwnerAlias,
            postId,
            timestamp,
            content,
            urls,
            mentions,
            lastFollowerAlias: nextLastFollowerAlias,
          }),
        })
      );

      console.log("FANOUT_CONTINUATION_ENQUEUED", {
        statusOwnerAlias,
        nextLastFollowerAlias,
      });
    }

    console.log("FANOUT_DONE_ONE_PAGE", {
      statusOwnerAlias,
      followersProcessedThisInvocation: followers.length,
    });
  }
};