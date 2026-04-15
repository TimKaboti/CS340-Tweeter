import { PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { StatusDAO, StatusDTO } from "../interfaces/StatusDAO";
import { docClient } from "./DynamoDBClient";

const TABLE_NAME = "statuses";

export class DynamoStatusDAO implements StatusDAO {
  async putStatus(status: StatusDTO): Promise<void> {
    await docClient.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          user_handle: status.alias,
          timestamp: status.timestamp.toString(), // IMPORTANT
          postId: status.postId,
          content: status.content,
          urls: status.urls,
          mentions: status.mentions,
        },
      })
    );
  }

  async getStory(
    alias: string,
    pageSize: number,
    lastTimestamp?: number
  ): Promise<{ values: StatusDTO[]; hasMorePages: boolean }> {
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

    const values: StatusDTO[] =
      result.Items?.map((item) => ({
        alias: item.user_handle,
        postId: item.postId,
        timestamp: Number(item.timestamp),
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