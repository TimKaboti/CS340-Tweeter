import {
    DeleteCommand,
    GetCommand,
    PutCommand,
    QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { FollowDAO, FollowRecord } from "../interfaces/FollowDAO";
import { docClient } from "./DynamoDBClient";

const TABLE_NAME = "follows";
const FOLLOWEE_INDEX = "follows_index";

export class DynamoFollowDAO implements FollowDAO {
    async putFollow(record: FollowRecord): Promise<void> {
        await docClient.send(
            new PutCommand({
                TableName: TABLE_NAME,
                Item: {
                    follower_handle: record.followerAlias,
                    followee_handle: record.followeeAlias,
                    followerDisplayName: record.followerDisplayName,
                    followeeDisplayName: record.followeeDisplayName,
                    followerImageUrl: record.followerImageUrl,
                    followeeImageUrl: record.followeeImageUrl,
                },
            })
        );
    }

    async deleteFollow(
        followerAlias: string,
        followeeAlias: string
    ): Promise<void> {
        await docClient.send(
            new DeleteCommand({
                TableName: TABLE_NAME,
                Key: {
                    follower_handle: followerAlias,
                    followee_handle: followeeAlias,
                },
            })
        );
    }

    async getIsFollower(
        followerAlias: string,
        followeeAlias: string
    ): Promise<boolean> {
        const result = await docClient.send(
            new GetCommand({
                TableName: TABLE_NAME,
                Key: {
                    follower_handle: followerAlias,
                    followee_handle: followeeAlias,
                },
            })
        );

        return !!result.Item;
    }

    async getFollowees(
        followerAlias: string,
        pageSize: number,
        lastFolloweeAlias?: string
    ): Promise<{ values: FollowRecord[]; hasMorePages: boolean }> {
        const result = await docClient.send(
            new QueryCommand({
                TableName: TABLE_NAME,
                KeyConditionExpression: "follower_handle = :follower",
                ExpressionAttributeValues: {
                    ":follower": followerAlias,
                },
                ExclusiveStartKey: lastFolloweeAlias
                    ? {
                        follower_handle: followerAlias,
                        followee_handle: lastFolloweeAlias,
                    }
                    : undefined,
                Limit: pageSize,
            })
        );

        return {
            values:
                result.Items?.map((item) => ({
                    followerAlias: item.follower_handle,
                    followeeAlias: item.followee_handle,
                    followerDisplayName: item.followerDisplayName,
                    followeeDisplayName: item.followeeDisplayName,
                    followerImageUrl: item.followerImageUrl,
                    followeeImageUrl: item.followeeImageUrl,
                })) ?? [],
            hasMorePages: !!result.LastEvaluatedKey,
        };
    }

    async getFollowers(
        followeeAlias: string,
        pageSize: number,
        lastFollowerAlias?: string
    ): Promise<{ values: FollowRecord[]; hasMorePages: boolean }> {
        const result = await docClient.send(
            new QueryCommand({
                TableName: TABLE_NAME,
                IndexName: FOLLOWEE_INDEX,
                KeyConditionExpression: "followee_handle = :followee",
                ExpressionAttributeValues: {
                    ":followee": followeeAlias,
                },
                ExclusiveStartKey: lastFollowerAlias
                    ? {
                        followee_handle: followeeAlias,
                        follower_handle: lastFollowerAlias,
                    }
                    : undefined,
                Limit: pageSize,
            })
        );

        return {
            values:
                result.Items?.map((item) => ({
                    followerAlias: item.follower_handle,
                    followeeAlias: item.followee_handle,
                    followerDisplayName: item.followerDisplayName,
                    followeeDisplayName: item.followeeDisplayName,
                    followerImageUrl: item.followerImageUrl,
                    followeeImageUrl: item.followeeImageUrl,
                })) ?? [],
            hasMorePages: !!result.LastEvaluatedKey,
        };
    }

    async getFollowerCount(alias: string): Promise<number> {
        const result = await docClient.send(
            new QueryCommand({
                TableName: TABLE_NAME,
                IndexName: FOLLOWEE_INDEX,
                KeyConditionExpression: "followee_handle = :followee",
                ExpressionAttributeValues: {
                    ":followee": alias,
                },
                Select: "COUNT",
            })
        );

        return result.Count ?? 0;
    }

    async getFolloweeCount(alias: string): Promise<number> {
        const result = await docClient.send(
            new QueryCommand({
                TableName: TABLE_NAME,
                KeyConditionExpression: "follower_handle = :follower",
                ExpressionAttributeValues: {
                    ":follower": alias,
                },
                Select: "COUNT",
            })
        );

        return result.Count ?? 0;
    }

    async getAllFollowersOfUser(followeeAlias: string): Promise<FollowRecord[]> {
        const followers: FollowRecord[] = [];
        let lastKey: any = undefined;

        do {
            const result = await docClient.send(
                new QueryCommand({
                    TableName: TABLE_NAME,
                    IndexName: FOLLOWEE_INDEX,
                    KeyConditionExpression: "followee_handle = :followee",
                    ExpressionAttributeValues: {
                        ":followee": followeeAlias,
                    },
                    ExclusiveStartKey: lastKey,
                })
            );

            if (result.Items) {
                followers.push(
                    ...result.Items.map((item) => ({
                        followerAlias: item.follower_handle,
                        followeeAlias: item.followee_handle,
                        followerDisplayName: item.followerDisplayName,
                        followeeDisplayName: item.followeeDisplayName,
                        followerImageUrl: item.followerImageUrl,
                        followeeImageUrl: item.followeeImageUrl,
                    }))
                );
            }

            lastKey = result.LastEvaluatedKey;
        } while (lastKey);

        return followers;
    }
}