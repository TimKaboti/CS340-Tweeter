import { TweeterRequest } from "./TweeterRequest";

export class LoginRequest implements TweeterRequest {
    public constructor(
        public alias: string,
        public password: string
    ) { }
}