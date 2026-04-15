import {
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PostStatusRequest,
  Status,
  TweeterResponse,
  User,
} from "tweeter-shared";

import { v4 as uuidv4 } from "uuid";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { DAOFactory } from "../dao/factory/DAOFactory";
import { DynamoDAOFactory } from "../dao/factory/DynamoDAOFactory";
import { AuthorizationService } from "./AuthorizationService";

export class StatusService {
  private factory: DAOFactory;
  private authorizationService: AuthorizationService;
  private sqs = new SQSClient({ region: "us-east-1" });
  private postStatusQueueUrl = process.env.POST_STATUS_QUEUE_URL || "";

  public constructor(factory: DAOFactory = new DynamoDAOFactory()) {
    this.factory = factory;
    this.authorizationService = new AuthorizationService(factory);
  }

  public async getFeed(
    request: PagedStatusItemRequest
  ): Promise<PagedStatusItemResponse> {
    const verifiedAlias = await this.authorizationService.verify(request.token);

    const feedDAO = this.factory.getFeedDAO();
    const userDAO = this.factory.getUserDAO();

    const lastStatus: Status | null = request.lastItem
      ? (Status.fromJson(JSON.stringify(request.lastItem)) as Status)
      : null;

    const result = await feedDAO.getFeed(
      verifiedAlias,
      request.pageSize,
      lastStatus?.timestamp,
      lastStatus?.id
    );

    const items: Status[] = [];

    for (const item of result.values) {
      const dbUser = await userDAO.getUserByAlias(item.statusOwnerAlias);

      const user = dbUser
        ? new User(
          dbUser.firstName,
          dbUser.lastName,
          dbUser.alias,
          dbUser.imageUrl
        )
        : new User("", "", item.statusOwnerAlias, "");

      items.push(new Status(item.postId, item.content, user, item.timestamp));
    }

    return new PagedStatusItemResponse(true, null, items, result.hasMorePages);
  }

  public async getStory(
    request: PagedStatusItemRequest
  ): Promise<PagedStatusItemResponse> {
    await this.authorizationService.verify(request.token);

    const statusDAO = this.factory.getStatusDAO();
    const userDAO = this.factory.getUserDAO();

    const lastStatus: Status | null = request.lastItem
      ? (Status.fromJson(JSON.stringify(request.lastItem)) as Status)
      : null;

    const result = await statusDAO.getStory(
      request.userAlias,
      request.pageSize,
      lastStatus?.timestamp,
      lastStatus?.id
    );

    const items: Status[] = [];

    for (const item of result.values) {
      const dbUser = await userDAO.getUserByAlias(item.alias);

      const user = dbUser
        ? new User(
          dbUser.firstName,
          dbUser.lastName,
          dbUser.alias,
          dbUser.imageUrl
        )
        : new User("", "", item.alias, "");

      items.push(new Status(item.postId, item.content, user, item.timestamp));
    }

    return new PagedStatusItemResponse(true, null, items, result.hasMorePages);
  }

  public async postStatus(
    request: PostStatusRequest
  ): Promise<TweeterResponse> {
    const currentUserAlias = await this.authorizationService.verify(request.token);

    const statusDAO = this.factory.getStatusDAO();

    const postId = uuidv4();
    const timestamp = Date.now();

    const status = Status.fromJson(JSON.stringify(request.newStatus)) as Status;
    const postText = status?.post;

    console.log("POST_STATUS_REQUEST", request);
    console.log("POST_STATUS_NEW_STATUS", request.newStatus);
    console.log("POST_STATUS_POST_TEXT", postText);
    console.log("POST_STATUS_POST_TEXT_TYPE", typeof postText);

    if (!postText || typeof postText !== "string") {
      throw new Error("Invalid post text");
    }

    const urls = this.extractUrls(postText);
    const mentions = this.extractMentions(postText);

    await statusDAO.putStatus({
      alias: currentUserAlias,
      postId,
      timestamp,
      content: postText,
      urls,
      mentions,
    });

    if (!this.postStatusQueueUrl) {
      throw new Error("POST_STATUS_QUEUE_URL environment variable is not set");
    }

    await this.sqs.send(
      new SendMessageCommand({
        QueueUrl: this.postStatusQueueUrl,
        MessageBody: JSON.stringify({
          statusOwnerAlias: currentUserAlias,
          postId,
          timestamp,
          content: postText,
          urls,
          mentions,
        }),
      })
    );

    return new TweeterResponse(true, null);
  }

  private extractUrls(post: string): string[] {
    return post
      .split(/(\s+)/)
      .filter(
        (word) => word.startsWith("http://") || word.startsWith("https://")
      );
  }

  private extractMentions(post: string): string[] {
    return post
      .split(/(\s+)/)
      .filter((word) => word.startsWith("@"))
      .map((word) => word.replace(/[^a-zA-Z0-9@]/g, ""));
  }
}