import { TweeterResponse } from "./TweeterResponse";

export class IsFollowerResponse extends TweeterResponse {
  public constructor(
    success: boolean,
    message: string | null,
    public isFollower: boolean
  ) {
    super(success, message);
  }
}