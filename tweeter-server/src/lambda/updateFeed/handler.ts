import { SQSHandler } from "aws-lambda";
import { DynamoDAOFactory } from "../../dao/factory/DynamoDAOFactory";

export const handler: SQSHandler = async (event) => {
  const factory = new DynamoDAOFactory();
  const feedDAO = factory.getFeedDAO();

  console.log("UPDATE_FEED_EVENT_RECORD_COUNT", event.Records.length);

  for (const record of event.Records) {
    const message = JSON.parse(record.body);

    const {
      statusOwnerAlias,
      postId,
      timestamp,
      content,
      urls,
      mentions,
      followers,
    } = message;

    console.log("UPDATE_FEED_MESSAGE", {
      statusOwnerAlias,
      postId,
      timestamp,
      content,
      followers,
    });

    if (!followers || followers.length === 0) {
      console.log("UPDATE_FEED_NO_FOLLOWERS");
      continue;
    }

    const feedItems = followers.map((followerAlias: string) => ({
      feedOwnerAlias: followerAlias,
      postId,
      timestamp,
      statusOwnerAlias,
      content,
      urls,
      mentions,
    }));

    console.log("UPDATE_FEED_WRITING_ITEMS", feedItems);

    await feedDAO.putFeedItems(feedItems);

    console.log("UPDATE_FEED_WRITE_COMPLETE", {
      itemCount: feedItems.length,
    });
  }
};