import {
    AuthenticateResponse,
    AuthToken,
    LoginRequest,
    LogoutRequest,
    RegisterRequest,
    TweeterResponse,
    User,
} from "tweeter-shared";

import { v4 as uuidv4 } from "uuid";
import { DAOFactory } from "../dao/factory/DAOFactory";
import { DynamoDAOFactory } from "../dao/factory/DynamoDAOFactory";
import { PasswordUtil } from "./PasswordUtil";
import { AliasUtil } from "../util/AliasUtil";

export class AuthService {
    private factory: DAOFactory;

    public constructor(factory: DAOFactory = new DynamoDAOFactory()) {
        this.factory = factory;
    }

    public async login(request: LoginRequest): Promise<AuthenticateResponse> {
        const userDAO = this.factory.getUserDAO();
        const authDAO = this.factory.getAuthDAO();

        const normalizedAlias = AliasUtil.normalize(request.alias);

        const dbUser = await userDAO.getUserByAlias(normalizedAlias);

        if (!dbUser) {
            return new AuthenticateResponse(false, "Invalid alias or password", null, null);
        }

        const validPassword = await PasswordUtil.compare(
            request.password,
            dbUser.passwordHash
        );

        if (!validPassword) {
            return new AuthenticateResponse(false, "Invalid alias or password", null, null);
        }

        const tokenValue = uuidv4();
        const timestamp = Date.now();

        await authDAO.createSession({
            token: tokenValue,
            alias: dbUser.alias,
            timestamp,
        });

        const user = new User(
            dbUser.firstName,
            dbUser.lastName,
            dbUser.alias,
            dbUser.imageUrl
        );

        const authToken = new AuthToken(tokenValue, timestamp);

        return new AuthenticateResponse(true, null, user, authToken);
    }

    public async register(
        request: RegisterRequest
    ): Promise<AuthenticateResponse> {
        const userDAO = this.factory.getUserDAO();
        const authDAO = this.factory.getAuthDAO();
        const s3DAO = this.factory.getS3DAO();

        const normalizedAlias = AliasUtil.normalize(request.alias);

        const existingUser = await userDAO.getUserByAlias(normalizedAlias);

        if (existingUser) {
            return new AuthenticateResponse(false, "Alias already exists", null, null);
        }

        const imageUrl = await s3DAO.putImage(
            `${normalizedAlias}-${Date.now()}.png`,
            request.userImageBase64
        );

        const passwordHash = await PasswordUtil.hash(request.password);

        await userDAO.putUser({
            firstName: request.firstName,
            lastName: request.lastName,
            alias: normalizedAlias,
            imageUrl,
            passwordHash,
        });

        const tokenValue = uuidv4();
        const timestamp = Date.now();

        await authDAO.createSession({
            token: tokenValue,
            alias: normalizedAlias,
            timestamp,
        });

        const user = new User(
            request.firstName,
            request.lastName,
            normalizedAlias,
            imageUrl
        );

        const authToken = new AuthToken(tokenValue, timestamp);

        return new AuthenticateResponse(true, null, user, authToken);
    }

    public async logout(request: LogoutRequest): Promise<TweeterResponse> {
        const authDAO = this.factory.getAuthDAO();

        await authDAO.deleteSession(request.token);

        return new TweeterResponse(true, null);
    }
}