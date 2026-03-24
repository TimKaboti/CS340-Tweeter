export class TweeterResponse {
    public constructor(
        public success: boolean,
        public message: string | null = null
    ) { }
}