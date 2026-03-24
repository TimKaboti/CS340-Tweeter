import "./Register.css";
import "bootstrap/dist/css/bootstrap.css";
import { useContext, useState, ChangeEvent } from "react";
import { UserInfoActionsContext } from "../../userInfo/UserInfoContexts";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import { AuthToken, User } from "tweeter-shared";
import { ToastActionsContext } from "../../toaster/ToastContexts";
import { Buffer } from "buffer";
import { ToastType } from "../../toaster/Toast";
import AuthenticationFields from "../AuthenticationFields";
import AuthService from "../../../service/AuthService";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [imageBytes, setImageBytes] = useState<Uint8Array>(new Uint8Array());
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageFileExtension, setImageFileExtension] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useContext(UserInfoActionsContext);
  const { displayToast } = useContext(ToastActionsContext);

  const authService = new AuthService();

  const checkSubmitButtonStatus = (): boolean => {
    return (
      !firstName ||
      !lastName ||
      !alias ||
      !password ||
      !imageUrl ||
      !imageFileExtension
    );
  };

  const registerOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" && !checkSubmitButtonStatus()) {
      doRegister();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    handleImageFile(file);
  };

  const handleImageFile = (file: File | undefined) => {
    if (file) {
      setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        setImageBytes(bytes);
      };
      reader.readAsDataURL(file);

      const fileExtension = getFileExtension(file);
      if (fileExtension) {
        setImageFileExtension(fileExtension);
      }
    } else {
      setImageUrl("");
      setImageBytes(new Uint8Array());
      setImageFileExtension("");
    }
  };

  const getFileExtension = (file: File): string | undefined => {
    return file.name.split(".").pop();
  };

  const doRegister = async () => {
    try {
      setIsLoading(true);

      const [user, authToken] = await register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );

      updateUserInfo(user, user, authToken, rememberMe);
      navigate(`/feed/${user.alias}`);
    } catch (error) {
      displayToast(
        ToastType.Error,
        `Failed to register user because of exception: ${error}`,
        0
      );
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    userImageBytes: Uint8Array,
    imageFileExtension: string
  ): Promise<[User, AuthToken]> => {
    const imageStringBase64: string =
      Buffer.from(userImageBytes).toString("base64");

    return authService.register(
      firstName,
      lastName,
      alias,
      password,
      imageFileExtension
    );
  };

  const inputFieldFactory = () => {
    return (
      <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="firstNameInput"
            placeholder="First Name"
            onKeyDown={registerOnEnter}
            onChange={(event) => setFirstName(event.target.value)}
          />
          <label htmlFor="firstNameInput">First Name</label>
        </div>

        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            id="lastNameInput"
            placeholder="Last Name"
            onKeyDown={registerOnEnter}
            onChange={(event) => setLastName(event.target.value)}
          />
          <label htmlFor="lastNameInput">Last Name</label>
        </div>

        <AuthenticationFields
          alias={alias}
          password={password}
          onAliasChange={setAlias}
          onPasswordChange={setPassword}
          onKeyDown={registerOnEnter}
        />

        <div className="form-floating mb-3">
          <input
            type="file"
            className="d-inline-block py-5 px-4 form-control bottom"
            id="imageFileInput"
            onKeyDown={registerOnEnter}
            onChange={handleFileChange}
          />
          {imageUrl.length > 0 && (
            <>
              <label htmlFor="imageFileInput">User Image</label>
              <img src={imageUrl} className="img-thumbnail" alt="" />
            </>
          )}
        </div>
      </>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Already registered? <Link to="/login">Sign in</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Register"
      submitButtonLabel="Register"
      oAuthHeading="Register with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doRegister}
    />
  );
};

export default Register;