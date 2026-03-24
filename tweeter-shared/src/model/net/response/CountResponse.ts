import { TweeterResponse } from "./TweeterResponse";

export class CountResponse extends TweeterResponse {
    public constructor(
        success: boolean,
        message: string | null,
        public count: number
    ) {
        super(success, message);
    }
}