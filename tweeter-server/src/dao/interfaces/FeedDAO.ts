export interface FeedItemDTO {
    feedOwnerAlias: string;
    postId: string;
    timestamp: number;
    statusOwnerAlias: string;
    content: string;
    urls: string[];
    mentions: string[];
}

export interface FeedDAO {
    putFeedItems(items: FeedItemDTO[]): Promise<void>;
    getFeed(
        alias: string,
        pageSize: number,
        lastTimestamp?: number,
        lastPostId?: string
    ): Promise<{ values: FeedItemDTO[]; hasMorePages: boolean }>;
}