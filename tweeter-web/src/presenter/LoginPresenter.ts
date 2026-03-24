import { AuthToken, User } from "tweeter-shared";
import AuthService from "../service/AuthService";

export interface LoginView {
  setLoading(isLoading: boolean): void;
  showError(message: string, durationMs: number): void;
  updateUserInfo(
    user: User,
    displayedUser: User,
    authToken: AuthToken,
    rememberMe: boolean
  ): void;
  navigate(url: string): void;
}

export default class LoginPresenter {
  private view: LoginView;
  private authService: AuthService;

  public constructor(view: LoginView) {
    this.view = view;
    this.authService = new AuthService();
  }

  public async login(alias: string, password: string): Promise<[User, AuthToken]> {
    return this.authService.login(alias, password);
  }

  public async submitLogin(
    alias: string,
    password: string,
    rememberMe: boolean,
    originalUrl?: string
  ): Promise<void> {
    try {
      this.view.setLoading(true);

      const [user, authToken] = await this.login(alias, password);

      this.view.updateUserInfo(user, user, authToken, rememberMe);

      if (originalUrl) {
        this.view.navigate(originalUrl);
      } else {
        this.view.navigate(`/feed/${user.alias}`);
      }
    } catch (error) {
      this.view.showError(
        `Failed to log user in because of exception: ${error}`,
        0
      );
    } finally {
      this.view.setLoading(false);
    }
  }
}