import { AuthToken, User } from "tweeter-shared";

export default class UserService {
  public async getUser(_authToken: AuthToken, _alias: string): Promise<User> {
    throw new Error("UserService.getUser not implemented yet");
  }
}
