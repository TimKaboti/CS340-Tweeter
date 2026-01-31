import { useContext } from "react";
import { ToastActionsContext } from "../components/toaster/ToastContexts";
import { ToastType } from "../components/toaster/Toast";

type LoadPageFn<T, AuthTokenType> = (
  authToken: AuthTokenType,
  userAlias: string,
  pageSize: number,
  lastItem: T | null
) => Promise<[T[], boolean]>;

export const useMessageActions = () => {
  const { displayToast } = useContext(ToastActionsContext);

  const loadMore = async <T, AuthTokenType>(args: {
    authToken: AuthTokenType;
    userAlias: string;
    pageSize: number;
    lastItem: T | null;
    loadPage: LoadPageFn<T, AuthTokenType>;
    setHasMoreItems: (value: boolean) => void;
    setLastItem: (value: T | null) => void;
    addItems: (items: T[]) => void;
    errorMessagePrefix: string;
  }) => {
    try {
      const [newItems, hasMore] = await args.loadPage(
        args.authToken,
        args.userAlias,
        args.pageSize,
        args.lastItem
      );

      args.setHasMoreItems(hasMore);

      // Important: handle empty page safely
      if (newItems.length > 0) {
        args.setLastItem(newItems[newItems.length - 1]);
        args.addItems(newItems);
      } else {
        args.setLastItem(args.lastItem);
      }
    } catch (error) {
      displayToast(
        ToastType.Error,
        `${args.errorMessagePrefix}: ${error}`,
        0
      );
    }
  };

  return { loadMore };
};

export default useMessageActions;
