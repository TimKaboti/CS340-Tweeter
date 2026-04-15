import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthToken, User } from "tweeter-shared";

import { ToastActionsContext } from "../components/toaster/ToastContexts";
import { ToastType } from "../components/toaster/Toast";

import useUserInfo from "./useUserInfo";
import useUserInfoActions from "./useUserInfoActions";
import UserService from "../service/UserService";

type FeaturePath = "/feed" | "/story" | "/followers" | "/followees";

const useUserNavigation = (featurePath: FeaturePath) => {
  const navigate = useNavigate();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayToast } = useContext(ToastActionsContext);

  const { displayedUser: displayedUserAliasParam } = useParams();
  const userService = new UserService();

  useEffect(() => {
    if (!authToken || !displayUserAliasParamSafe(displayedUserAliasParam)) return;

    if (!displayedUser || displayedUserAliasParam !== displayedUser.alias) {
      getUser(authToken, displayedUserAliasParam).then((toUser) => {
        if (toUser) setDisplayedUser(toUser);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedUserAliasParam, authToken]);

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    return userService.getUser(authToken, alias);
  };

  const displayUserAliasParamSafe = (alias: string | undefined): alias is string => {
    return !!alias && alias.trim().length > 0;
  };

  const normalizeAlias = (alias: string): string => {
    const trimmed = alias.trim();
    return trimmed.startsWith("@") ? trimmed.substring(1) : trimmed;
  };

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    try {
      if (!authToken || !displayedUser) return;

      const target = event.currentTarget as HTMLAnchorElement;
      const aliasText = target.textContent ?? "";
      const alias = normalizeAlias(aliasText);

      if (!alias) {
        throw new Error("Invalid user alias");
      }

      const toUser = await getUser(authToken, alias);

      if (toUser && !toUser.equals(displayedUser)) {
        setDisplayedUser(toUser);
        navigate(`${featurePath}/${toUser.alias}`);
      }
    } catch (error) {
      displayToast(
        ToastType.Error,
        `Failed to get user because of exception: ${error}`,
        0
      );
    }
  };

  return { navigateToUser };
};

export default useUserNavigation;