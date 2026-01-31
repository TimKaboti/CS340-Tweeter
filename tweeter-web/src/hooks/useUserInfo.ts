import { useContext } from "react";
import { UserInfoContext } from "../components/userInfo/UserInfoContexts";

const useUserInfo = () => {
  return useContext(UserInfoContext);
};

export default useUserInfo;
