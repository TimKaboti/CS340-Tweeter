import { AuthToken, User } from "tweeter-shared";
import StatusItemPresenter, { StatusItemView } from "./StatusItemPresenter";

export default class FeedPresenter extends StatusItemPresenter {
  public constructor(view: StatusItemView) {
    super(view);
  }

  public async loadMoreItems(authToken: AuthToken, user: User, pageSize: number): Promise<void> {
    try {
      const [newItems, hasMore] = await this.service.loadMoreFeed(
        authToken,
        user,
        pageSize,
        this.lastItem
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;

      this.view.addItems(newItems);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      this.view.displayErrorMessage(`Failed to load feed items: ${msg}`);
    }
  }
}
