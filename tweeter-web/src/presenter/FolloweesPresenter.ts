import { AuthToken, User } from "tweeter-shared";
import UserItemPresenter, { UserItemView } from "./UserItemPresenter";

export default class FolloweesPresenter extends UserItemPresenter {
  public constructor(view: UserItemView) {
    super(view);
  }

  protected itemDescription(): string {
    return "load followees";
  }

  protected async getMoreItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    return this.followService.loadMoreFollowees(
      authToken,
      userAlias,
      pageSize,
      lastItem
    );
  }
}