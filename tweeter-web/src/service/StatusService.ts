import {
  AuthToken,
  PagedStatusItemRequest,
  PostStatusRequest,
  Status,
} from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export default class StatusService {
  private serverFacade = new ServerFacade();

  public async loadMoreFeed(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    last: Status | null
  ): Promise<[Status[], boolean]> {
    const request = new PagedStatusItemRequest(
      authToken.token,
      userAlias,
      pageSize,
      last
    );

    return this.serverFacade.getMoreFeed(request);
  }

  public async loadMoreStory(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    last: Status | null
  ): Promise<[Status[], boolean]> {
    const request = new PagedStatusItemRequest(
      authToken.token,
      userAlias,
      pageSize,
      last
    );

    return this.serverFacade.getMoreStory(request);
  }

  public async postStatus(
    authToken: AuthToken,
    newStatus: Status
  ): Promise<void> {
    const request = new PostStatusRequest(authToken.token, newStatus);
    await this.serverFacade.postStatus(request);
  }
}