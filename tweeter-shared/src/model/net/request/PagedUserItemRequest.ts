import { User } from "../../domain/User";
import { TweeterRequest } from "./TweeterRequest";

export class PagedUserItemRequest implements TweeterRequest {
    public constructor(
        public token: string,
        public userAlias: string,
        public pageSize: number,
        public lastItem: User | null
    ) { }
}