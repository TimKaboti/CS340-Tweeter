
import UserService from "../service/UserService";
import { AuthToken } from "tweeter-shared";

export interface AppNavbarView {
    displayInfoMessage(message: string, duration: number): string;
    displayErrorMessage(message: string, duration: number): void;
    deleteMessage(messageId: string): void;
    clearUserInfo(): void;
    navigateToLogin(): void;
}

export class AppNavbarPresenter {
    private _view: AppNavbarView;
    private _userService: UserService;

    public constructor(view: AppNavbarView) {
        this._view = view;
        this._userService = new UserService();
    }

    protected get userService(): UserService {
        return this._userService;
    }

    public async logout(authToken: AuthToken): Promise<void> {
        const toastId = this._view.displayInfoMessage("Logging Out...", 0);

        try {
            await this.userService.logout(authToken);

            this._view.deleteMessage(toastId);
            this._view.clearUserInfo();
            this._view.navigateToLogin();
        } catch (e) {
            this._view.displayErrorMessage(
                `Failed to log user out because of exception ${(e as Error).message}`,
                0
            );
        }
    }
}