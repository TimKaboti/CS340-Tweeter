import { UserRequest, UserResponse, User } from "tweeter-shared";
import { DAOFactory } from "../dao/factory/DAOFactory";
import { DynamoDAOFactory } from "../dao/factory/DynamoDAOFactory";
import { AuthorizationService } from "./AuthorizationService";
import { AliasUtil } from "../util/AliasUtil";

export class UserService {
  private factory: DAOFactory;
  private authorizationService: AuthorizationService;

  public constructor(factory: DAOFactory = new DynamoDAOFactory()) {
    this.factory = factory;
    this.authorizationService = new AuthorizationService(factory);
  }

  public async getUser(request: UserRequest): Promise<UserResponse> {
    await this.authorizationService.verify(request.token);

    const userDAO = this.factory.getUserDAO();
    const normalizedAlias = AliasUtil.normalize(request.alias);
    const user = await userDAO.getUserByAlias(normalizedAlias);

    if (!user) {
      return new UserResponse(false, "User not found", null);
    }

    const userObj = new User(
      user.firstName,
      user.lastName,
      user.alias,
      user.imageUrl
    );

    return new UserResponse(true, null, userObj);
  }
}