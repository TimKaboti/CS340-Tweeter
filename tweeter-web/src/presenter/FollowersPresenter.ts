import { AuthToken } from "tweeter-shared";
import FollowService from "../service/FollowService";
import UserItemPresenter, { UserItemView } from "./UserItemPresenter";

export default class FollowersPresenter extends UserItemPresenter {
  private followService = new FollowService();

  public constructor(view: UserItemView) {
    super(view);
  }

  public async loadMoreItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number
  ): Promise<void> {
    try {
      const [newItems, hasMore] = await this.followService.loadMoreFollowers(
        authToken,
        userAlias,
        pageSize,
        this.lastItem
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;

      this.view.addItems(newItems);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      this.view.displayErrorMessage(`Failed to load followers: ${msg}`);
    }
  }
}
