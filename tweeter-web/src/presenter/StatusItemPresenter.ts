import { AuthToken, Status, User } from "tweeter-shared";
import StatusService from "../service/StatusService";

export interface StatusItemView {
  addItems(items: Status[]): void;
  displayErrorMessage(message: string): void;
}

export default abstract class StatusItemPresenter {
  private _view: StatusItemView;

  protected service: StatusService;

  private _hasMoreItems: boolean = true;
  private _lastItem: Status | null = null;

  protected constructor(view: StatusItemView) {
    this._view = view;
    this.service = new StatusService();
  }

  protected get view(): StatusItemView {
    return this._view;
  }

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }

  protected get lastItem(): Status | null {
    return this._lastItem;
  }

  protected set lastItem(value: Status | null) {
    this._lastItem = value;
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
