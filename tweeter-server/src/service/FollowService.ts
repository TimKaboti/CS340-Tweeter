import {
    CountRequest,
    CountResponse,
    FollowActionRequest,
    IsFollowerRequest,
    IsFollowerResponse,
    PagedUserItemRequest,
    PagedUserItemResponse,
    TweeterResponse,
    User,
} from "tweeter-shared";

import { DAOFactory } from "../dao/factory/DAOFactory";
import { DynamoDAOFactory } from "../dao/factory/DynamoDAOFactory";
import { AuthorizationService } from "./AuthorizationService";

export class FollowService {
    private factory: DAOFactory;
    private authorizationService: AuthorizationService;

    public constructor(factory: DAOFactory = new DynamoDAOFactory()) {
        this.factory = factory;
        this.authorizationService = new AuthorizationService(factory);
    }

    public async getFollowers(
        request: PagedUserItemRequest
    ): Promise<PagedUserItemResponse> {
        await this.authorizationService.verify(request.token);

        const followDAO = this.factory.getFollowDAO();
        const normalizedUserAlias = this.normalizeAlias(request.userAlias);
        const lastAlias = request.lastItem
            ? this.normalizeAlias(request.lastItem.alias)
            : undefined;

        const result = await followDAO.getFollowers(
            normalizedUserAlias,
            request.pageSize,
            lastAlias
        );

        const users = result.values.map(
            (record) =>
                new User(
                    this.parseFirstName(record.followerDisplayName),
                    this.parseLastName(record.followerDisplayName),
                    record.followerAlias,
                    record.followerImageUrl
                )
        );

        return new PagedUserItemResponse(true, null, users, result.hasMorePages);
    }

    public async getFollowees(
        request: PagedUserItemRequest
    ): Promise<PagedUserItemResponse> {
        await this.authorizationService.verify(request.token);
        console.log("FOLLOW_SERVICE_GET_FOLLOWEES_RUNNING");

        const followDAO = this.factory.getFollowDAO();
        const normalizedUserAlias = this.normalizeAlias(request.userAlias);
        const lastAlias = request.lastItem
            ? this.normalizeAlias(request.lastItem.alias)
            : undefined;

        const result = await followDAO.getFollowees(
            normalizedUserAlias,
            request.pageSize,
            lastAlias
        );

        const users = result.values.map(
            (record) =>
                new User(
                    this.parseFirstName(record.followeeDisplayName),
                    this.parseLastName(record.followeeDisplayName),
                    record.followeeAlias,
                    record.followeeImageUrl
                )
        );
        console.log("FOLLOWEES_RESPONSE_SHAPE", {
            usersCount: users.length,
            hasMore: result.hasMorePages,
        });
        return new PagedUserItemResponse(true, null, users, result.hasMorePages);
    }

    public async getFollowerCount(
        request: CountRequest
    ): Promise<CountResponse> {
        await this.authorizationService.verify(request.token);

        const followDAO = this.factory.getFollowDAO();
        const normalizedUserAlias = this.normalizeAlias(request.userAlias);
        const count = await followDAO.getFollowerCount(normalizedUserAlias);

        return new CountResponse(true, null, count);
    }

    public async getFolloweeCount(
        request: CountRequest
    ): Promise<CountResponse> {
        await this.authorizationService.verify(request.token);

        const followDAO = this.factory.getFollowDAO();
        const normalizedUserAlias = this.normalizeAlias(request.userAlias);
        const count = await followDAO.getFolloweeCount(normalizedUserAlias);

        return new CountResponse(true, null, count);
    }

    public async isFollower(
        request: IsFollowerRequest
    ): Promise<IsFollowerResponse> {
        await this.authorizationService.verify(request.token);

        const followDAO = this.factory.getFollowDAO();

        const isFollower = await followDAO.getIsFollower(
            this.normalizeAlias(request.userAlias),
            this.normalizeAlias(request.selectedUserAlias)
        );

        return new IsFollowerResponse(true, null, isFollower);
    }

    public async follow(
        request: FollowActionRequest
    ): Promise<TweeterResponse> {
        const currentUserAlias = this.normalizeAlias(
            await this.authorizationService.verify(request.token)
        );
        const normalizedTargetAlias = this.normalizeAlias(request.targetUserAlias);

        const followDAO = this.factory.getFollowDAO();
        const userDAO = this.factory.getUserDAO();

        const follower = await userDAO.getUserByAlias(currentUserAlias);
        const followee = await userDAO.getUserByAlias(normalizedTargetAlias);

        if (!follower || !followee) {
            return new TweeterResponse(false, "User not found");
        }

        await followDAO.putFollow({
            followerAlias: follower.alias,
            followeeAlias: followee.alias,
            followerDisplayName: `${follower.firstName} ${follower.lastName}`,
            followeeDisplayName: `${followee.firstName} ${followee.lastName}`,
            followerImageUrl: follower.imageUrl,
            followeeImageUrl: followee.imageUrl,
        });

        return new TweeterResponse(true, null);
    }

    public async unfollow(
        request: FollowActionRequest
    ): Promise<TweeterResponse> {
        const currentUserAlias = this.normalizeAlias(
            await this.authorizationService.verify(request.token)
        );
        const normalizedTargetAlias = this.normalizeAlias(request.targetUserAlias);

        const followDAO = this.factory.getFollowDAO();

        await followDAO.deleteFollow(currentUserAlias, normalizedTargetAlias);

        return new TweeterResponse(true, null);
    }

    private normalizeAlias(alias: string): string {
        const trimmed = alias.trim();
        return trimmed.startsWith("@") ? trimmed.substring(1) : trimmed;
    }

    private parseFirstName(displayName: string): string {
        const parts = displayName.trim().split(" ");
        return parts[0] ?? "";
    }

    private parseLastName(displayName: string): string {
        const parts = displayName.trim().split(" ");
        return parts.slice(1).join(" ");
    }
}