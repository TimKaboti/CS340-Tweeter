import {
    AuthToken,
    LoginRequest,
    LogoutRequest,
    RegisterRequest,
    User,
} from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export default class AuthService {
    private serverFacade = new ServerFacade();

    public async login(alias: string, password: string): Promise<[User, AuthToken]> {
        const request = new LoginRequest(alias, password);
        return this.serverFacade.login(request);
    }

    public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBase64: string
    ): Promise<[User, AuthToken]> {
        const request = new RegisterRequest(
            firstName,
            lastName,
            alias,
            password,
            userImageBase64
        );

        return this.serverFacade.register(request);
    }

    public async logout(authToken: AuthToken): Promise<void> {
        const request = new LogoutRequest(authToken.token);
        await this.serverFacade.logout(request);
    }
}