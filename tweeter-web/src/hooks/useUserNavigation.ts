import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthToken, FakeData, User } from "tweeter-shared";

import { ToastActionsContext } from "../components/toaster/ToastContexts";
import { ToastType } from "../components/toaster/Toast";

import useUserInfo from "./useUserInfo";
import useUserInfoActions from "./useUserInfoActions";

type FeaturePath = "/feed" | "/story" | "/followers" | "/followees";

const useUserNavigation = (featurePath: FeaturePath) => {
  const navigate = useNavigate();
  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayToast } = useContext(ToastActionsContext);

  const { displayedUser: displayedUserAliasParam } = useParams();

  useEffect(() => {
    if (!authToken || !displayedUserAliasParam) return;

    if (!displayedUser || displayedUserAliasParam !== displayedUser.alias) {
      getUser(authToken, displayedUserAliasParam).then((toUser) => {
        if (toUser) setDisplayedUser(toUser);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedUserAliasParam, authToken]);

  const getUser = async (_authToken: AuthToken, alias: string): Promise<User | null> => {
    return FakeData.instance.findUserByAlias(alias);
  };

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    try {
      if (!authToken || !displayedUser) return;

      const alias = extractAlias(event.target.toString());
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
