import { AuthToken, Status } from "tweeter-shared";
import StatusItemPresenter from "./StatusItemPresenter";

export default class FeedPresenter extends StatusItemPresenter {
  protected itemDescription(): string {
    return "load feed items";
  }

  protected async getMoreItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return this.service.loadMoreFeed(authToken, userAlias, pageSize, lastItem);
  }
}