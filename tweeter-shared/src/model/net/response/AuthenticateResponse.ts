import { AuthToken } from "../../domain/AuthToken";
import { User } from "../../domain/User";
import { TweeterResponse } from "./TweeterResponse";

export class AuthenticateResponse extends TweeterResponse {
    public constructor(
        success: boolean,
        message: string | null,
        public user: User | null,
        public token: AuthToken | null
    ) {
        super(success, message);
    }
}