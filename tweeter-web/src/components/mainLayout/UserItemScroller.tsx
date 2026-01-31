import { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import { AuthToken, FakeData, User } from "tweeter-shared";

import { ToastActionsContext } from "../toaster/ToastContexts";
import { ToastType } from "../toaster/Toast";
import {
  UserInfoActionsContext,
  UserInfoContext,
} from "../userInfo/UserInfoContexts";

import UserItem from "../userItem/UserItem";

export const PAGE_SIZE = 10;

interface Props {
  featurePath: "/followers" | "/followees";
}

const UserItemScroller = (props: Props) => {
  const { displayToast } = useContext(ToastActionsContext);

  const [items, setItems] = useState<User[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [lastItem, setLastItem] = useState<User | null>(null);

  const { displayedUser, authToken } = useContext(UserInfoContext);
  const { setDisplayedUser } = useContext(UserInfoActionsContext);
  const { displayedUser: displayedUserAliasParam } = useParams();

  const addItems = (newItems: User[]) =>
    setItems((previousItems) => [...previousItems, ...newItems]);

  const reset = () => {
    setItems([]);
    setLastItem(null);
    setHasMoreItems(true);
  };

  // Keep displayed user in sync with URL param (back/forward buttons)
  useEffect(() => {
    if (!authToken || !displayedUserAliasParam) return;

    if (!displayedUser || displayedUserAliasParam !== displayedUser.alias) {
      getUser(authToken, displayedUserAliasParam).then((toUser) => {
        if (toUser) setDisplayedUser(toUser);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedUserAliasParam, authToken]);

  // Re-init whenever displayed user changes (ONLY when ready)
  useEffect(() => {
    if (!authToken || !displayedUser) return;

    reset();
    loadMoreItems(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedUser, authToken]);

  const loadMoreItems = async (last: User | null) => {
    if (!authToken || !displayedUser) return;

    try {
      const [newItems, hasMore] = await loadMoreUsers(
        authToken,
        displayedUser.alias,
        PAGE_SIZE,
        last
      );

      setHasMoreItems(hasMore);

      if (newItems.length > 0) {
        setLastItem(newItems[newItems.length - 1]);
        addItems(newItems);
      } else {
        setHasMoreItems(false);
      }
    } catch (error) {
      displayToast(
        ToastType.Error,
        `Failed to load ${props.featurePath.substring(1)} because of exception: ${error}`,
        0
      );
    }
  };

  const loadMoreUsers = async (
    _authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastUser: User | null
  ): Promise<[User[], boolean]> => {
    // TODO: Replace with server call later
    return FakeData.instance.getPageOfUsers(lastUser, pageSize, userAlias);
  };

  const getUser = async (
    _authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with server call later
    return FakeData.instance.findUserByAlias(alias);
  };

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={() => loadMoreItems(lastItem)}
        hasMore={hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <UserItem user={item} featurePath={props.featurePath} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default UserItemScroller;
