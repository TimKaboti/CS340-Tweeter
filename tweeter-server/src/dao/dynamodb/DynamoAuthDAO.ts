import { DeleteCommand, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { AuthDAO, SessionDTO } from "../interfaces/AuthDAO";
import { docClient } from "./DynamoDBClient";

const TABLE_NAME = "sessions";

export class DynamoAuthDAO implements AuthDAO {
    async createSession(session: SessionDTO): Promise<void> {
        await docClient.send(
            new PutCommand({
                TableName: TABLE_NAME,
                Item: session,
            })
        );
    }

    async getSession(token: string): Promise<SessionDTO | null> {
        const result = await docClient.send(
            new GetCommand({
                TableName: TABLE_NAME,
                Key: { token },
            })
        );

        return (result.Item as SessionDTO) ?? null;
    }

    async deleteSession(token: string): Promise<void> {
        await docClient.send(
            new DeleteCommand({
                TableName: TABLE_NAME,
                Key: { token },
            })
        );
    }
}