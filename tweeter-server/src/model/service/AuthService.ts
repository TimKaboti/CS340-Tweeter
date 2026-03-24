import {
    AuthenticateResponse,
    AuthToken,
    FakeData,
    LoginRequest,
    LogoutRequest,
    RegisterRequest,
    TweeterResponse,
    User
} from "tweeter-shared";

export class AuthService {
    public async login(_request: LoginRequest): Promise<AuthenticateResponse> {
        const user = FakeData.instance.firstUser;

        const token = new AuthToken(Date.now().toString(), Date.now());

        return new AuthenticateResponse(true, null, user, token);
    }

    public async register(
        request: RegisterRequest
    ): Promise<AuthenticateResponse> {
        const user = new User(
            request.firstName,
            request.lastName,
            request.alias,
            request.imageUrl
        );

        const token = new AuthToken(Date.now().toString(), Date.now());

        return new AuthenticateResponse(true, null, user, token);
    }

    public async logout(_request: LogoutRequest): Promise<TweeterResponse> {
        return new TweeterResponse(true, null);
    }
}