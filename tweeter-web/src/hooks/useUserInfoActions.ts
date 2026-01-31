import { useContext } from "react";
import { UserInfoActionsContext } from "../components/userInfo/UserInfoContexts";

const useUserInfoActions = () => {
  return useContext(UserInfoActionsContext);
};

export default useUserInfoActions;
