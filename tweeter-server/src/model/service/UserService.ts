import { FakeData, UserRequest, UserResponse } from "tweeter-shared";

export class UserService {
  public async getUser(request: UserRequest): Promise<UserResponse> {
    const user = FakeData.instance.firstUser;

    return new UserResponse(true, null, user);
  }
}