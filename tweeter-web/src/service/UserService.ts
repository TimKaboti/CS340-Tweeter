import { AuthToken, User } from "tweeter-shared";

export default class UserService {
  public async getUser(_authToken: AuthToken, _alias: string): Promise<User> {
    throw new Error("UserService.getUser not implemented yet");
  }


  public async logout(authToken: AuthToken): Promise<void> {
    // TODO: Replace with a real server call later
    // For now, just resolve successfully.
    return;
  }

  
}
