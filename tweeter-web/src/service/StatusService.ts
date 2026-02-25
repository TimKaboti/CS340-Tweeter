import { AuthToken, FakeData, Status } from "tweeter-shared";

export default class StatusService {
  async loadMoreFeed(
    _authToken: AuthToken,
    _userAlias: string,
    pageSize: number,
    last: Status | null
  ): Promise<[Status[], boolean]> {
    return FakeData.instance.getPageOfStatuses(last, pageSize);
  }

  async loadMoreStory(
    _authToken: AuthToken,
    _userAlias: string,
    pageSize: number,
    last: Status | null
  ): Promise<[Status[], boolean]> {
    return FakeData.instance.getPageOfStatuses(last, pageSize);
  }

  public async postStatus(_authToken: AuthToken, _newStatus: Status): Promise<void> {
    await new Promise((f) => setTimeout(f, 2000));
  }
}