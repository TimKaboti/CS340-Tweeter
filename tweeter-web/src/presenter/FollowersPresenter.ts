import { AuthToken, User } from "tweeter-shared";
import UserItemPresenter from "./UserItemPresenter";

export default class FollowersPresenter extends UserItemPresenter {
  protected itemDescription(): string {
    return "load followers";
  }

  protected getMoreItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    return this.service.loadMoreFollowers(authToken, userAlias, pageSize, lastItem);
  }
}