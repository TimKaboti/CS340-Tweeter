import { instance, mock, spy, verify, when, anything } from "@typestrong/ts-mockito";
import { AuthToken } from "tweeter-shared";

import { AppNavbarPresenter, AppNavbarView } from "../src/presenter/AppNavbarPresenter";
import UserService from "../src/service/UserService";
describe("AppNavbarPresenter", () => {
    let mockView: AppNavbarView;
    let view: AppNavbarView;

    let presenterSpy: AppNavbarPresenter;
    let presenter: AppNavbarPresenter;

    let mockUserService: UserService;
    let userService: UserService;

    const authToken = new AuthToken("test-token", Date.now());

    beforeEach(() => {
        mockView = mock<AppNavbarView>();
        view = instance(mockView);

        mockUserService = mock<UserService>();
        userService = instance(mockUserService);

        presenterSpy = spy(new AppNavbarPresenter(view));
        presenter = instance(presenterSpy);

        when(presenterSpy["userService"]).thenReturn(userService);

        when(mockView.displayInfoMessage("Logging Out...", 0)).thenReturn("toast-123");
    });

    it("The presenter tells the view to display a logging out message.", async () => {
        await presenter.logout(authToken);

        verify(mockView.displayInfoMessage("Logging Out...", 0)).once();
    });

    it("The presenter calls logout on the user service with the correct auth token.", async () => {
        await presenter.logout(authToken);

        verify(mockUserService.logout(authToken)).once();
    });

    it("When the logout is successful, the presenter tells the view to clear the info message, clear user info, and navigate to login.", async () => {
        await presenter.logout(authToken);

        verify(mockView.deleteMessage("toast-123")).once();
        verify(mockView.clearUserInfo()).once();
        verify(mockView.navigateToLogin()).once();

        verify(mockView.displayErrorMessage(anything(), anything())).never();
    });

    it("When the logout is not successful, the presenter displays an error and does not clear info/user/navigate.", async () => {
        when(mockUserService.logout(anything())).thenThrow(new Error("boom"));

        await presenter.logout(authToken);

        verify(mockView.displayErrorMessage(anything(), 0)).once();

        verify(mockView.deleteMessage(anything())).never();
        verify(mockView.clearUserInfo()).never();
        verify(mockView.navigateToLogin()).never();
    });
});