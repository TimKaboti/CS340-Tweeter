export interface FollowRecord {
    followerAlias: string;
    followeeAlias: string;
    followerDisplayName: string;
    followeeDisplayName: string;
    followerImageUrl: string;
    followeeImageUrl: string;
}

export interface FollowDAO {
    putFollow(record: FollowRecord): Promise<void>;
    deleteFollow(followerAlias: string, followeeAlias: string): Promise<void>;
    getIsFollower(followerAlias: string, followeeAlias: string): Promise<boolean>;
    getFollowees(
        followerAlias: string,
        pageSize: number,
        lastFolloweeAlias?: string
    ): Promise<{ values: FollowRecord[]; hasMorePages: boolean }>;
    getFollowers(
        followeeAlias: string,
        pageSize: number,
        lastFollowerAlias?: string
    ): Promise<{ values: FollowRecord[]; hasMorePages: boolean }>;
    getFollowerCount(alias: string): Promise<number>;
    getFolloweeCount(alias: string): Promise<number>;
    getAllFollowersOfUser(followeeAlias: string): Promise<FollowRecord[]>;
}