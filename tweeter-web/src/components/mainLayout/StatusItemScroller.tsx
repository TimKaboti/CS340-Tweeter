import { useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { AuthToken, FakeData, Status } from "tweeter-shared";

import StatusItem from "../statusItem/StatusItem";

import useMessageList from "../../hooks/useMessageList";
import useMessageActions from "../../hooks/useMessageActions";
import useUserInfo from "../../hooks/useUserInfo";
import useUserNavigation from "../../hooks/useUserNavigation";

export const PAGE_SIZE = 10;

interface Props {
  featurePath: "/feed" | "/story";
}

const StatusItemScroller = ({ featurePath }: Props) => {
  const { displayedUser, authToken } = useUserInfo();
  const { navigateToUser } = useUserNavigation(featurePath);

  const { items, hasMoreItems, setHasMoreItems, lastItem, setLastItem, addItems, reset } =
    useMessageList<Status>();

  const { loadMore } = useMessageActions();

  useEffect(() => {
    if (!authToken || !displayedUser) return;

    reset();
    loadMoreItems(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedUser, authToken]);

  const loadMoreStatuses = async (
    _authToken: AuthToken,
    _userAlias: string,
    pageSize: number,
    last: Status | null
  ): Promise<[Status[], boolean]> => {
    return FakeData.instance.getPageOfStatuses(last, pageSize);
  };

  const loadMoreItems = async (last: Status | null) => {
    if (!authToken || !displayedUser) return;

    await loadMore<Status, AuthToken>({
      authToken,
      userAlias: displayedUser.alias,
      pageSize: PAGE_SIZE,
      lastItem: last,
      loadPage: loadMoreStatuses,
      setHasMoreItems,
      setLastItem,
      addItems,
      errorMessagePrefix: `Failed to load ${featurePath.substring(1)} items`,
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
          <StatusItem
            key={index}
            status={item}
            linkTo={`${featurePath}/${item.user.alias}`}
            featurePath={featurePath}
            onNavigateToUser={navigateToUser}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default StatusItemScroller;
