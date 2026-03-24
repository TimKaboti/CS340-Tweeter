import { AuthToken, User, UserRequest } from "tweeter-shared";
import { ServerFacade } from "../network/ServerFacade";

export default class UserService {
  private serverFacade = new ServerFacade();

  public async getUser(authToken: AuthToken, alias: string): Promise<User> {
    const request = new UserRequest(authToken.token, alias);
    return this.serverFacade.getUser(request);
  }
}