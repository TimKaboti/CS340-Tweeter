import { AuthToken, User } from "tweeter-shared";
import StatusItemPresenter, { StatusItemView } from "./StatusItemPresenter";

export default class FeedPresenter extends StatusItemPresenter {
  public constructor(view: StatusItemView) {
    super(view);
  }

  protected itemDescription(): string {
    return "load feed items";
  }

  protected async getMoreItems(
    authToken: AuthToken,
    user: User,
    pageSize: number,
    lastItem: any
  ): Promise<[any[], boolean]> {
    return this.service.loadMoreFeed(
      authToken,
      user,
      pageSize,
      lastItem
    );
  }
}