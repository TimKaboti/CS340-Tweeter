import { DAOFactory } from "./DAOFactory";
import { UserDAO } from "../interfaces/UserDAO";
import { AuthDAO } from "../interfaces/AuthDAO";
import { S3DAO } from "../interfaces/S3DAO";
import { FollowDAO } from "../interfaces/FollowDAO";
import { StatusDAO } from "../interfaces/StatusDAO";
import { FeedDAO } from "../interfaces/FeedDAO";

import { DynamoUserDAO } from "../dynamodb/DynamoUserDAO";
import { DynamoAuthDAO } from "../dynamodb/DynamoAuthDAO";
import { S3ImageDAO } from "../dynamodb/S3ImageDAO";
import { DynamoFollowDAO } from "../dynamodb/DynamoFollowDAO";
import { DynamoStatusDAO } from "../dynamodb/DynamoStatusDAO";
import { DynamoFeedDAO } from "../dynamodb/DynamoFeedDAO";

export class DynamoDAOFactory implements DAOFactory {
    getUserDAO(): UserDAO {
        return new DynamoUserDAO();
    }

    getAuthDAO(): AuthDAO {
        return new DynamoAuthDAO();
    }

    getS3DAO(): S3DAO {
        return new S3ImageDAO();
    }

    getFollowDAO(): FollowDAO {
        return new DynamoFollowDAO();
    }

    getStatusDAO(): StatusDAO {
        return new DynamoStatusDAO();
    }

    getFeedDAO(): FeedDAO {
        return new DynamoFeedDAO();
    }
}