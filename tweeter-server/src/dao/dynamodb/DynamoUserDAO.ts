import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
import { UserDAO, UserDTO } from "../interfaces/UserDAO";
import { docClient } from "./DynamoDBClient";

const TABLE_NAME = "users";

export class DynamoUserDAO implements UserDAO {
    async putUser(user: UserDTO): Promise<void> {
        await docClient.send(
            new PutCommand({
                TableName: TABLE_NAME,
                Item: user,
            })
        );
    }

    async getUserByAlias(alias: string): Promise<UserDTO | null> {
        const result = await docClient.send(
            new GetCommand({
                TableName: TABLE_NAME,
                Key: { alias },
            })
        );

        return (result.Item as UserDTO) ?? null;
    }
}