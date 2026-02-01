import { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { AuthToken, FakeData, User } from "tweeter-shared";

import UserItem from "../userItem/UserItem";

import useMessageList from "../../hooks/useMessageList";
import useMessageActions from "../../hooks/useMessageActions";
import useUserInfo from "../../hooks/useUserInfo";
import useUserNavigation from "../../hooks/useUserNavigation";

export const PAGE_SIZE = 10;

interface Props {
  featurePath: "/followers" | "/followees";
}

const UserItemScroller = ({ featurePath }: Props) => {
  const { displayedUser, authToken } = useUserInfo();
  const { navigateToUser } = useUserNavigation(featurePath);

  const { items, hasMoreItems, setHasMoreItems, lastItem, setLastItem, addItems, reset } =
    useMessageList<User>();

  const { loadMore } = useMessageActions();

  useEffect(() => {
    if (!authToken || !displayedUser) return;

    reset();
    loadMoreItems(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedUser, authToken]);

  const loadMoreUsers = async (
    _authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    last: User | null
  ): Promise<[User[], boolean]> => {
    return FakeData.instance.getPageOfUsers(last, pageSize, userAlias);
  };

  const loadMoreItems = async (last: User | null) => {
    if (!authToken || !displayedUser) return;

    await loadMore<User, AuthToken>({
      authToken,
      userAlias: displayedUser.alias,
      pageSize: PAGE_SIZE,
      lastItem: last,
      loadPage: loadMoreUsers,
      setHasMoreItems,
      setLastItem,
      addItems,
      errorMessagePrefix: `Failed to load ${featurePath.substring(1)}`,
    });
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
            <UserItem user={item} featurePath={featurePath} />
        </div>
        ))}

      </InfiniteScroll>
    </div>
  );
};

export default UserItemScroller;
