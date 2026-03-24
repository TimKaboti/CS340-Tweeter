import {
  FakeData,
  PagedStatusItemRequest,
  PagedStatusItemResponse,
  PostStatusRequest,
  Status,
  TweeterResponse,
} from "tweeter-shared";

export class StatusService {
  public async getFeed(
    request: PagedStatusItemRequest
  ): Promise<PagedStatusItemResponse> {
    const lastItem: Status | null = request.lastItem
      ? (Status.fromJson(JSON.stringify(request.lastItem)) as Status)
      : null;

    const [items, hasMore] = FakeData.instance.getPageOfStatuses(
      lastItem,
      request.pageSize
    );

    return new PagedStatusItemResponse(true, null, items, hasMore);
  }

  public async getStory(
    request: PagedStatusItemRequest
  ): Promise<PagedStatusItemResponse> {
    const lastItem: Status | null = request.lastItem
      ? (Status.fromJson(JSON.stringify(request.lastItem)) as Status)
      : null;

    const [items, hasMore] = FakeData.instance.getPageOfStatuses(
      lastItem,
      request.pageSize
    );

    return new PagedStatusItemResponse(true, null, items, hasMore);
  }

  public async postStatus(
    _request: PostStatusRequest
  ): Promise<TweeterResponse> {
    return new TweeterResponse(true, null);
  }
}