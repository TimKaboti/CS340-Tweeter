import { User } from "../../domain/User";
import { TweeterResponse } from "./TweeterResponse";

export class UserResponse extends TweeterResponse {
    public constructor(
        success: boolean,
        message: string | null,
        public user: User | null
    ) {
        super(success, message);
    }
}