import { TweeterRequest } from "./TweeterRequest";

export class RegisterRequest implements TweeterRequest {
    public constructor(
        public firstName: string,
        public lastName: string,
        public alias: string,
        public password: string,
        public userImageBase64: string
    ) { }
}