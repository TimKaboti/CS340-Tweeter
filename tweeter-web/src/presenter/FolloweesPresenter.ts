import { AuthToken, User } from "tweeter-shared";
import UserItemPresenter from "./UserItemPresenter";

export default class FolloweesPresenter extends UserItemPresenter {
  protected itemDescription(): string {
    return "load followees";
  }

  protected getMoreItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    return this.service.loadMoreFollowees(authToken, userAlias, pageSize, lastItem);
  }
}