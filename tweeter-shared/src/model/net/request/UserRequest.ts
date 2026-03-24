import { TweeterRequest } from "./TweeterRequest";

export class UserRequest implements TweeterRequest {
    public constructor(
        public token: string,
        public alias: string
    ) { }
}