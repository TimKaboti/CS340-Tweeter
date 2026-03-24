import { TweeterRequest } from "./TweeterRequest";

export class IsFollowerRequest implements TweeterRequest {
    public constructor(
        public token: string,
        public userAlias: string,
        public selectedUserAlias: string
    ) { }
}