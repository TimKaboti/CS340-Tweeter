import { TweeterRequest } from "./TweeterRequest";

export class CountRequest implements TweeterRequest {
    public constructor(
        public token: string,
        public userAlias: string
    ) { }
}