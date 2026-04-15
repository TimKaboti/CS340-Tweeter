export interface StatusDTO {
    alias: string;
    postId: string;
    timestamp: number;
    content: string;
    urls: string[];
    mentions: string[];
}

export interface StatusDAO {
    putStatus(status: StatusDTO): Promise<void>;
    getStory(
        alias: string,
        pageSize: number,
        lastTimestamp?: number,
        lastPostId?: string
    ): Promise<{ values: StatusDTO[]; hasMorePages: boolean }>;
}