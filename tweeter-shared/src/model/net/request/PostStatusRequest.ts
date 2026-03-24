import { Status } from "../../domain/Status";
import { TweeterRequest } from "./TweeterRequest";

export class PostStatusRequest implements TweeterRequest {
    public constructor(
        public token: string,
        public newStatus: Status
    ) { }
}