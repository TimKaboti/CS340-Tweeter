import { AuthToken, Status, User } from "tweeter-shared";

export interface StatusView {
  addItems(items: Status[]): void;
  displayErrorMessage(message: string): void;
}

export default abstract class StatusPresenter {
  private _view: StatusView;

  private _hasMoreItems: boolean = true;
  private _lastItem: Status | null = null;

  protected constructor(view: StatusView) {
    this._view = view;
  }

  protected get view(): StatusView {
    return this._view;
  }

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  protected get lastItem(): Status | null {
    return this._lastItem;
  }

  protected set lastItem(value: Status | null) {
    this._lastItem = value;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  public reset(): void {
    this._hasMoreItems = true;
    this._lastItem = null;
  }

  public abstract loadMoreItems(
    authToken: AuthToken,
    user: User,
    pageSize: number
  ): Promise<void>;
}
