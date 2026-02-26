import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";
import { useContext, useRef, useState } from "react";
import { UserInfoActionsContext } from "../../userInfo/UserInfoContexts";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { ToastActionsContext } from "../../toaster/ToastContexts";
import { ToastType } from "../../toaster/Toast";
import AuthenticationFields from "../AuthenticationFields";

import LoginPresenter, { LoginView } from "../../../presenter/LoginPresenter";

interface Props {
  originalUrl?: string;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useContext(UserInfoActionsContext);
  const { displayToast } = useContext(ToastActionsContext);

  const listener: LoginView = {
    setLoading: (loading: boolean) => setIsLoading(loading),
    showError: (message: string, durationMs: number) =>
      displayToast(ToastType.Error, message, durationMs),
    updateUserInfo: (user, displayedUser, authToken, remember) =>
      updateUserInfo(user, displayedUser, authToken, remember),
    navigate: (url: string) => navigate(url),
  };

  const presenterRef = useRef<LoginPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new LoginPresenter(listener);
  }

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const loginOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" && !checkSubmitButtonStatus()) {
      doLogin();
    }
  };

  const doLogin = async () => {
    await presenterRef.current!.submitLogin(
      alias,
      password,
      rememberMe,
      props.originalUrl
    );
  };

  const inputFieldFactory = () => {
    return (
      <AuthenticationFields
        alias={alias}
        password={password}
        onAliasChange={setAlias}
        onPasswordChange={setPassword}
        onKeyDown={loginOnEnter}
      />
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;