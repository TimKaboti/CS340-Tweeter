import { TweeterRequest } from "./TweeterRequest";

export class LogoutRequest implements TweeterRequest {
    public constructor(public token: string) { }
}