import { AuthToken } from "tweeter-shared";
import Presenter, { View } from "./presenter";

export interface PagedItemView<T> extends View {
  addItems(items: T[]): void;
}

export default abstract class PagedItemPresenter<T> extends Presenter<PagedItemView<T>> {
  protected readonly pageSize: number = 10;
  protected _hasMoreItems = true;
  protected _lastItem: T | null = null;

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  protected get lastItem(): T | null {
    return this._lastItem;
  }

  public reset(): void {
    this._hasMoreItems = true;
    this._lastItem = null;
  }

  public async loadMoreItems(authToken: AuthToken, userAlias: string, pageSize: number): Promise<void> {
    await this.doFailureReportingOperation(async () => {
      const [newItems, hasMore] = await this.getMoreItems(authToken, userAlias, pageSize, this._lastItem);

      this._hasMoreItems = hasMore;
      this._lastItem = newItems.length > 0 ? newItems[newItems.length - 1] : null;

      this.view.addItems(newItems);
    }, this.itemDescription());
  }

  protected abstract itemDescription(): string;

  protected abstract getMoreItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: T | null
  ): Promise<[T[], boolean]>;
}