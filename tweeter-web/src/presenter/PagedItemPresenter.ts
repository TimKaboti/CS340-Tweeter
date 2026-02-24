import { AuthToken } from "tweeter-shared";
import Presenter, { View } from "./presenter";

export interface PagedItemView<T> extends View {
  addItems(items: T[]): void;
}

export default abstract class PagedItemPresenter<T> extends Presenter<PagedItemView<T>> {
  private _hasMoreItems = true;
  protected lastItem: T | null = null;

  protected constructor(view: PagedItemView<T>) {
    super(view);
  }

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  public reset(): void {
    this._hasMoreItems = true;
    this.lastItem = null;
  }

  // TEMPLATE METHOD (same for all 4 presenters)
  public async loadMoreItems(
    authToken: AuthToken,
    userOrAlias: any,
    pageSize: number
  ): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const [newItems, hasMore] = await this.getMoreItems(
        authToken,
        userOrAlias,
        pageSize,
        this.lastItem
      );

      this.hasMoreItems = hasMore;
      this.lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;

      this.view.addItems(newItems);
    }, this.itemDescription());
  }

  protected abstract itemDescription(): string;

  protected abstract getMoreItems(
    authToken: AuthToken,
    userOrAlias: any,
    pageSize: number,
    lastItem: T | null
  ): Promise<[T[], boolean]>;
}