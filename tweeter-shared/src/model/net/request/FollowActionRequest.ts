import { TweeterRequest } from "./TweeterRequest";

export class FollowActionRequest implements TweeterRequest {
    public constructor(
        public token: string,
        public targetUserAlias: string
    ) { }
}