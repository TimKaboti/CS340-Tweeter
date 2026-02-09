// src/service/StatusService.ts
import { AuthToken, FakeData, Status, User } from "tweeter-shared";

export default class StatusService {
  async loadMoreFeed(
    _authToken: AuthToken,
    _user: User,
    pageSize: number,
    last: Status | null
  ): Promise<[Status[], boolean]> {
    return FakeData.instance.getPageOfStatuses(last, pageSize);
  }

  async loadMoreStory(
    _authToken: AuthToken,
    _user: User,
    pageSize: number,
    last: Status | null
  ): Promise<[Status[], boolean]> {
    return FakeData.instance.getPageOfStatuses(last, pageSize);
  }


  public async postStatus(_authToken: AuthToken, _newStatus: Status): Promise<void> {
    // Pause so we can see the posting message. Remove when connected to the server
    await new Promise((f) => setTimeout(f, 2000));
  }


}
