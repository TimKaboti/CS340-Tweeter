import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "../src/components/authentication/login/Login";
import LoginPresenter from "../src/presenter/LoginPresenter";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// ✅ Mock presenter class so we can verify calls
const submitLoginMock = jest.fn();

jest.mock("../src/presenter/LoginPresenter", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      submitLogin: submitLoginMock,
    })),
  };
});

describe("Login Component", () => {
  const setup = async () => {
    const user = userEvent.setup();
    render(
    <MemoryRouter>
        <Login />
    </MemoryRouter>
    );

    const signInButton = screen.getByRole("button", { name: /sign in/i });

    const aliasField =
      screen.queryByLabelText(/alias/i) ??
      screen.queryByPlaceholderText(/alias|@/i);

    const passwordField =
      screen.queryByLabelText(/password/i) ??
      screen.queryByPlaceholderText(/password/i);

    if (!aliasField || !passwordField) {
      throw new Error("Could not find alias/password inputs. Update selectors in Login.test.tsx.");
    }

    return { user, signInButton, aliasField, passwordField };
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("When first rendered the sign-in button is disabled.", async () => {
    const { signInButton } = await setup();
    expect(signInButton).toBeDisabled();
  });

  it("The sign-in button is enabled when both the alias and password fields have text.", async () => {
    const { user, signInButton, aliasField, passwordField } = await setup();

    await user.type(aliasField, "@bob");
    await user.type(passwordField, "pw");

    expect(signInButton).toBeEnabled();
  });

  it("The sign-in button is disabled if either the alias or password field is cleared.", async () => {
    const { user, signInButton, aliasField, passwordField } = await setup();

    await user.type(aliasField, "@bob");
    await user.type(passwordField, "pw");
    expect(signInButton).toBeEnabled();

    await user.clear(aliasField);
    expect(signInButton).toBeDisabled();

    await user.type(aliasField, "@bob");
    expect(signInButton).toBeEnabled();

    await user.clear(passwordField);
    expect(signInButton).toBeDisabled();
  });

  it("The presenter's login method is called with correct parameters when the sign-in button is pressed.", async () => {
    const { user, signInButton, aliasField, passwordField } = await setup();

    await user.type(aliasField, "@bob");
    await user.type(passwordField, "pw");
    await user.click(signInButton);

    // Ensure presenter constructed
    expect(LoginPresenter).toHaveBeenCalledTimes(1);

    // Your component calls submitLogin(alias, password, rememberMe, originalUrl)
    expect(submitLoginMock).toHaveBeenCalledTimes(1);
    expect(submitLoginMock).toHaveBeenCalledWith("@bob", "pw", false, undefined);
  });
});