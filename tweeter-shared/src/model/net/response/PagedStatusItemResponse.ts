import { Status } from "../../domain/Status";
import { TweeterResponse } from "./TweeterResponse";

export class PagedStatusItemResponse extends TweeterResponse {
    public constructor(
        success: boolean,
        message: string | null,
        public items: Status[] | null,
        public hasMore: boolean
    ) {
        super(success, message);
    }
}