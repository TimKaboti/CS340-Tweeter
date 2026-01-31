import { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useNavigate, useParams } from "react-router-dom";
import { AuthToken, FakeData, Status, User } from "tweeter-shared";

import { ToastActionsContext } from "../toaster/ToastContexts";
import { ToastType } from "../toaster/Toast";
import {
  UserInfoActionsContext,
  UserInfoContext,
} from "../userInfo/UserInfoContexts";

import StatusItem from "../statusItem/StatusItem";

export const PAGE_SIZE = 10;

interface Props {
  featurePath: "/feed" | "/story";
}

const StatusItemScroller = (props: Props) => {
  const { displayToast } = useContext(ToastActionsContext);

  const [items, setItems] = useState<Status[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const [lastItem, setLastItem] = useState<Status | null>(null);

  const navigate = useNavigate();

  const { displayedUser, authToken } = useContext(UserInfoContext);
  const { setDisplayedUser } = useContext(UserInfoActionsContext);
  const { displayedUser: displayedUserAliasParam } = useParams();

  const addItems = (newItems: Status[]) =>
    setItems((previousItems) => [...previousItems, ...newItems]);

  // Keep displayed user in sync with URL param (back/forward buttons)
  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam !== displayedUser!.alias
    ) {
      getUser(authToken, displayedUserAliasParam).then((toUser) => {
        if (toUser) {
          setDisplayedUser(toUser);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedUserAliasParam]);

  // Re-init whenever displayed user changes
  useEffect(() => {
    reset();
    loadMoreItems(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedUser]);

  const reset = () => {
    setItems([]);
    setLastItem(null);
    setHasMoreItems(true);
  };

  const loadMoreItems = async (last: Status | null) => {
    try {
      const [newItems, hasMore] = await loadMoreStatuses(
        authToken!,
        displayedUser!.alias,
        PAGE_SIZE,
        last
      );

      setHasMoreItems(hasMore);
      setLastItem(newItems[newItems.length - 1]);
      addItems(newItems);
    } catch (error) {
      displayToast(
        ToastType.Error,
        `Failed to load items because of exception: ${error}`,
        0
      );
    }
  };

  const loadMoreStatuses = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    // TODO: Replace with server call later
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with server call later
    return FakeData.instance.findUserByAlias(alias);
  };

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    try {
      const alias = extractAlias(event.target.toString());
      const toUser = await getUser(authToken!, alias);

      if (toUser && !toUser.equals(displayedUser!)) {
        setDisplayedUser(toUser);
        navigate(`${props.featurePath}/${toUser.alias}`);
      }
    } catch (error) {
      displayToast(
        ToastType.Error,
        `Failed to get user because of exception: ${error}`,
        0
      );
    }
  };

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
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
          <StatusItem
            key={index}
            status={item}
            linkTo={`${props.featurePath}/${item.user.alias}`}
            featurePath={props.featurePath}
            onNavigateToUser={navigateToUser}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default StatusItemScroller;
