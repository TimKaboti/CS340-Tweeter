import {
    CountRequest,
    CountResponse,
    FakeData,
    FollowActionRequest,
    IsFollowerRequest,
    IsFollowerResponse,
    PagedUserItemRequest,
    PagedUserItemResponse,
    TweeterResponse,
} from "tweeter-shared";

export class FollowService {
    public async getFollowers(
        request: PagedUserItemRequest
    ): Promise<PagedUserItemResponse> {
        const [items, hasMore] = FakeData.instance.getPageOfUsers(
            request.lastItem,
            request.pageSize,
            request.userAlias
        );

        return new PagedUserItemResponse(true, null, items, hasMore);
    }

    public async getFollowees(
        request: PagedUserItemRequest
    ): Promise<PagedUserItemResponse> {
        const [items, hasMore] = FakeData.instance.getPageOfUsers(
            request.lastItem,
            request.pageSize,
            request.userAlias
        );

        return new PagedUserItemResponse(true, null, items, hasMore);
    }

    public async getFollowerCount(
        request: CountRequest
    ): Promise<CountResponse> {
        return new CountResponse(
            true,
            null,
            await FakeData.instance.getFollowerCount(request.userAlias)
        );
    }

    public async getFolloweeCount(
        request: CountRequest
    ): Promise<CountResponse> {
        return new CountResponse(
            true,
            null,
            await FakeData.instance.getFolloweeCount(request.userAlias)
        );
    }

    public async isFollower(
        _request: IsFollowerRequest
    ): Promise<IsFollowerResponse> {
        return new IsFollowerResponse(true, null, true);
    }

    public async follow(
        _request: FollowActionRequest
    ): Promise<TweeterResponse> {
        return new TweeterResponse(true, null);
    }

    public async unfollow(
        _request: FollowActionRequest
    ): Promise<TweeterResponse> {
        return new TweeterResponse(true, null);
    }
}