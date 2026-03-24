import {
  AuthToken,
  CountRequest,
  FollowActionRequest,
  IsFollowerRequest,
  PagedUserItemRequest,
  User,
} from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export default class FollowService {
  private serverFacade = new ServerFacade();

  public async loadMoreFollowees(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request = new PagedUserItemRequest(
      authToken.token,
      userAlias,
      pageSize,
      lastItem
    );

    return this.serverFacade.getMoreFollowees(request);
  }

  public async loadMoreFollowers(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: User | null
  ): Promise<[User[], boolean]> {
    const request = new PagedUserItemRequest(
      authToken.token,
      userAlias,
      pageSize,
      lastItem
    );

    return this.serverFacade.getMoreFollowers(request);
  }

  public async getFolloweeCount(
    authToken: AuthToken,
    userAlias: string
  ): Promise<number> {
    const request = new CountRequest(authToken.token, userAlias);
    return this.serverFacade.getFolloweeCount(request);
  }

  public async getFollowerCount(
    authToken: AuthToken,
    userAlias: string
  ): Promise<number> {
    const request = new CountRequest(authToken.token, userAlias);
    return this.serverFacade.getFollowerCount(request);
  }

  public async getIsFollowerStatus(
    authToken: AuthToken,
    userAlias: string,
    selectedUserAlias: string
  ): Promise<boolean> {
    const request = new IsFollowerRequest(
      authToken.token,
      userAlias,
      selectedUserAlias
    );

    return this.serverFacade.isFollower(request);
  }

  public async follow(
    authToken: AuthToken,
    userToFollowAlias: string
  ): Promise<void> {
    const request = new FollowActionRequest(
      authToken.token,
      userToFollowAlias
    );

    await this.serverFacade.follow(request);
  }

  public async unfollow(
    authToken: AuthToken,
    userToFollowAlias: string
  ): Promise<void> {
    const request = new FollowActionRequest(
      authToken.token,
      userToFollowAlias
    );

    await this.serverFacade.unfollow(request);
  }
}