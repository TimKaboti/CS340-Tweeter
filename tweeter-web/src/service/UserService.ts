import { AuthToken, User } from "tweeter-shared";

export default class UserService {
  public async getUser(_authToken: AuthToken, _alias: string): Promise<User> {
    // Milestone 2A: you can implement later; your UserItemScroller doesn’t currently need this.
    throw new Error("UserService.getUser not implemented yet");
  }
}
