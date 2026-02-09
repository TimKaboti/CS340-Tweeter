import { AuthToken, User } from "tweeter-shared";
import UserService from "../service/UserService"; // you can stub later if you don’t have it yet

export interface UserItemView {
  addItems(items: User[]): void;
  displayErrorMessage(message: string): void;
}

export default abstract class UserItemPresenter {
  private _view: UserItemView;

  private _hasMoreItems: boolean = true;
  private _lastItem: User | null = null;

  // optional shared services
  protected userService = new UserService();

  protected constructor(view: UserItemView) {
    this._view = view;
  }

  protected get view(): UserItemView {
    return this._view;
  }

  public get hasMoreItems(): boolean {
    return this._hasMoreItems;
  }

  protected get lastItem(): User | null {
    return this._lastItem;
  }

  protected set lastItem(value: User | null) {
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
    userAlias: string,
    pageSize: number
  ): Promise<void>;
}
