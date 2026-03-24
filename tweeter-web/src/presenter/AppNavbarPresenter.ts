import { AuthToken } from "tweeter-shared";
import AuthService from "../service/AuthService";

export interface AppNavbarView {
    displayInfoMessage(message: string, duration: number): string;
    deleteMessage(id: string): void;
    clearUserInfo(): void;
    navigateToLogin(): void;
    displayErrorMessage(message: string, duration: number): void;
}

export class AppNavbarPresenter {
    private view: AppNavbarView;
    private authService = new AuthService();

    public constructor(view: AppNavbarView) {
        this.view = view;
    }

    public async logout(authToken: AuthToken): Promise<void> {
        const toastId = this.view.displayInfoMessage("Logging Out...", 0);

        try {
            await this.authService.logout(authToken);
            this.view.deleteMessage(toastId);
            this.view.clearUserInfo();
            this.view.navigateToLogin();
        } catch (e) {
            this.view.displayErrorMessage(
                `Failed to log user out because of exception: ${e}`,
                0
            );
        }
    }
}