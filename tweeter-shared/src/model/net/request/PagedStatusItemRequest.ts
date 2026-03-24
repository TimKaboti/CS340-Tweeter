import { Status } from "../../domain/Status";
import { TweeterRequest } from "./TweeterRequest";

export class PagedStatusItemRequest implements TweeterRequest {
    public constructor(
        public token: string,
        public userAlias: string,
        public pageSize: number,
        public lastItem: Status | null
    ) { }
}