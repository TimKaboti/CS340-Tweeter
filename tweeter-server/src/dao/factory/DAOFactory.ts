import { UserDAO } from "../interfaces/UserDAO";
import { AuthDAO } from "../interfaces/AuthDAO";
import { S3DAO } from "../interfaces/S3DAO";
import { FollowDAO } from "../interfaces/FollowDAO";
import { StatusDAO } from "../interfaces/StatusDAO";
import { FeedDAO } from "../interfaces/FeedDAO";

export interface DAOFactory {
    getUserDAO(): UserDAO;
    getAuthDAO(): AuthDAO;
    getS3DAO(): S3DAO;
    getFollowDAO(): FollowDAO;
    getStatusDAO(): StatusDAO;
    getFeedDAO(): FeedDAO;
}