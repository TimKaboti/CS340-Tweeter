import { BatchWriteCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { FeedDAO, FeedItemDTO } from "../interfaces/FeedDAO";
import { docClient } from "./DynamoDBClient";

const TABLE_NAME = "feed";

function chunkArray<T>(items: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
        chunks.push(items.slice(i, i + size));
    }
    return chunks;
}

export class DynamoFeedDAO implements FeedDAO {
    async putFeedItems(items: FeedItemDTO[]): Promise<void> {
        const chunks = chunkArray(items, 25);

        for (const chunk of chunks) {
            await docClient.send(
                new BatchWriteCommand({
                    RequestItems: {
                        [TABLE_NAME]: chunk.map((item) => ({
                            PutRequest: {
                                Item: {
                                    user_handle: item.feedOwnerAlias,
                                    timestamp: item.timestamp.toString(),
                                    postId: item.postId,
                                    statusOwnerAlias: item.statusOwnerAlias,
                                    content: item.content,
                                    urls: item.urls,
                                    mentions: item.mentions,
                                },
                            },
                        })),
                    },
                })
            );
        }
    }

    async getFeed(
        alias: string,
        pageSize: number,
        lastTimestamp?: number,
        lastPostId?: string
    ): Promise<{ values: FeedItemDTO[]; hasMorePages: boolean }> {
        const result = await docClient.send(
            new QueryCommand({
                TableName: TABLE_NAME,
                KeyConditionExpression: "user_handle = :alias",
                ExpressionAttributeValues: {
                    ":alias": alias,
                },
                ExclusiveStartKey:
                    lastTimestamp !== undefined
                        ? {
                            user_handle: alias,
                            timestamp: lastTimestamp.toString(),
                        }
                        : undefined,
                Limit: pageSize,
                ScanIndexForward: false,
            })
        );

        const values: FeedItemDTO[] =
            result.Items?.map((item) => ({
                feedOwnerAlias: item.user_handle,
                postId: item.postId,
                timestamp: Number(item.timestamp),
                statusOwnerAlias: item.statusOwnerAlias,
                content: item.content,
                urls: item.urls ?? [],
                mentions: item.mentions ?? [],
            })) ?? [];

        return {
            values,
            hasMorePages: !!result.LastEvaluatedKey,
        };
    }
}