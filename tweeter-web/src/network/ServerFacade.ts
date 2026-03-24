import {
    AuthenticateResponse,
    AuthToken,
    CountRequest,
    CountResponse,
    LoginRequest,
    LogoutRequest,
    PagedStatusItemRequest,
    PagedStatusItemResponse,
    PagedUserItemRequest,
    PagedUserItemResponse,
    PostStatusRequest,
    RegisterRequest,
    TweeterResponse,
    User,
    UserRequest,
    UserResponse,
    Status,
    FollowActionRequest,
    IsFollowerRequest,
    IsFollowerResponse,
} from "tweeter-shared";
import { ClientCommunicator } from "./ClientCommunicator";

export class ServerFacade {
    // Replace this with your actual deployed API Gateway base URL
    private SERVER_URL = "https://5z5xky0vdf.execute-api.us-east-1.amazonaws.com/dev";
    private clientCommunicator = new ClientCommunicator(this.SERVER_URL);

    public async login(request: LoginRequest): Promise<[User, AuthToken]> {
        const response = await this.clientCommunicator.doPost<
            LoginRequest,
            AuthenticateResponse
        >(request, "/user/login");

        if (!response.success || !response.user || !response.token) {
            throw new Error(response.message ?? "Unable to login");
        }

        return [
            User.fromJson(JSON.stringify(response.user)) as User,
            AuthToken.fromJson(JSON.stringify(response.token)) as AuthToken,
        ];
    }

    public async register(request: RegisterRequest): Promise<[User, AuthToken]> {
        const response = await this.clientCommunicator.doPost<
            RegisterRequest,
            AuthenticateResponse
        >(request, "/user/register");

        if (!response.success || !response.user || !response.token) {
            throw new Error(response.message ?? "Unable to register");
        }

        return [
            User.fromJson(JSON.stringify(response.user)) as User,
            AuthToken.fromJson(JSON.stringify(response.token)) as AuthToken,
        ];
    }

    public async logout(request: LogoutRequest): Promise<void> {
        const response = await this.clientCommunicator.doPost<
            LogoutRequest,
            TweeterResponse
        >(request, "/user/logout");

        if (!response.success) {
            throw new Error(response.message ?? "Unable to logout");
        }
    }

    public async getMoreFollowees(
        request: PagedUserItemRequest
    ): Promise<[User[], boolean]> {
        const response = await this.clientCommunicator.doPost<
            PagedUserItemRequest,
            PagedUserItemResponse
        >(request, "/followee/list");

        if (!response.success || !response.items) {
            throw new Error(response.message ?? "Unable to get followees");
        }

        const items = response.items.map(
            (item) => User.fromJson(JSON.stringify(item)) as User
        );

        return [items, response.hasMore];
    }

    public async getMoreFollowers(
        request: PagedUserItemRequest
    ): Promise<[User[], boolean]> {
        const response = await this.clientCommunicator.doPost<
            PagedUserItemRequest,
            PagedUserItemResponse
        >(request, "/follower/list");

        if (!response.success || !response.items) {
            throw new Error(response.message ?? "Unable to get followers");
        }

        const items = response.items.map(
            (item) => User.fromJson(JSON.stringify(item)) as User
        );

        return [items, response.hasMore];
    }

    public async getMoreFeed(
        request: PagedStatusItemRequest
    ): Promise<[Status[], boolean]> {
        const response = await this.clientCommunicator.doPost<
            PagedStatusItemRequest,
            PagedStatusItemResponse
        >(request, "/status/feed");

        if (!response.success || !response.items) {
            throw new Error(response.message ?? "Unable to get feed");
        }

        const items = response.items.map(
            (item) => Status.fromJson(JSON.stringify(item)) as Status
        );

        return [items, response.hasMore];
    }

    public async getMoreStory(
        request: PagedStatusItemRequest
    ): Promise<[Status[], boolean]> {
        const response = await this.clientCommunicator.doPost<
            PagedStatusItemRequest,
            PagedStatusItemResponse
        >(request, "/status/story");

        if (!response.success || !response.items) {
            throw new Error(response.message ?? "Unable to get story");
        }

        const items = response.items.map(
            (item) => Status.fromJson(JSON.stringify(item)) as Status
        );

        return [items, response.hasMore];
    }

    public async postStatus(request: PostStatusRequest): Promise<void> {
        const response = await this.clientCommunicator.doPost<
            PostStatusRequest,
            TweeterResponse
        >(request, "/status/post");

        if (!response.success) {
            throw new Error(response.message ?? "Unable to post status");
        }
    }

    public async getUser(request: UserRequest): Promise<User> {
        const response = await this.clientCommunicator.doPost<
            UserRequest,
            UserResponse
        >(request, "/user/get");

        if (!response.success || !response.user) {
            throw new Error(response.message ?? "Unable to get user");
        }

        return User.fromJson(JSON.stringify(response.user)) as User;
    }

    public async getFollowerCount(request: CountRequest): Promise<number> {
        const response = await this.clientCommunicator.doPost<
            CountRequest,
            CountResponse
        >(request, "/follower/count");

        if (!response.success) {
            throw new Error(response.message ?? "Unable to get follower count");
        }

        return response.count;
    }

    public async getFolloweeCount(request: CountRequest): Promise<number> {
        const response = await this.clientCommunicator.doPost<
            CountRequest,
            CountResponse
        >(request, "/followee/count");

        if (!response.success) {
            throw new Error(response.message ?? "Unable to get followee count");
        }

        return response.count;
    }

    public async isFollower(request: IsFollowerRequest): Promise<boolean> {
        const response = await this.clientCommunicator.doPost<
            IsFollowerRequest,
            IsFollowerResponse
        >(request, "/follow/is-follower");

        if (!response.success) {
            throw new Error(response.message ?? "Unable to get follower status");
        }

        return response.isFollower;
    }

    public async follow(request: FollowActionRequest): Promise<void> {
        const response = await this.clientCommunicator.doPost<
            FollowActionRequest,
            TweeterResponse
        >(request, "/follow/add");

        if (!response.success) {
            throw new Error(response.message ?? "Unable to follow user");
        }
    }

    public async unfollow(request: FollowActionRequest): Promise<void> {
        const response = await this.clientCommunicator.doPost<
            FollowActionRequest,
            TweeterResponse
        >(request, "/follow/remove");

        if (!response.success) {
            throw new Error(response.message ?? "Unable to unfollow user");
        }
    }
}