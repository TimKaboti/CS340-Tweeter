import { User } from "../../domain/User";
import { TweeterResponse } from "./TweeterResponse";

export class PagedUserItemResponse extends TweeterResponse {
    public constructor(
        success: boolean,
        message: string | null,
        public items: User[] | null,
        public hasMore: boolean
    ) {
        super(success, message);
    }
}