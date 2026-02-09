import { useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Status } from "tweeter-shared";

import StatusItem from "../statusItem/StatusItem";

import useMessageList from "../../hooks/useMessageList";
import useUserInfo from "../../hooks/useUserInfo";
import useUserNavigation from "../../hooks/useUserNavigation";

// presenter types
import StatusItemPresenter, { StatusItemView } from "../../presenter/StatusItemPresenter";

export const PAGE_SIZE = 10;

interface Props {
  featurePath: "/feed" | "/story";
  presenterFactory: (view: StatusItemView) => StatusItemPresenter;
}


const StatusItemScroller = ({ featurePath, presenterFactory }: Props) => {
  const { displayedUser, authToken } = useUserInfo();
  const { navigateToUser } = useUserNavigation(featurePath);

  const { items, addItems, reset } = useMessageList<Status>();

  // Observer (View interface implementation)
  const listener: StatusItemView = {
    addItems: (newItems: Status[]) => addItems(newItems),
    displayErrorMessage: (message: string) => {
      // If you have a toaster hook method you prefer, swap it in here.
      alert(message);
    },
  };

  // Persist presenter across rerenders
  const presenterRef = useRef<StatusItemPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = presenterFactory(listener);
  }

  const loadMoreItems = async () => {
    if (!authToken || !displayedUser) return;
    await presenterRef.current!.loadMoreItems(authToken, displayedUser, PAGE_SIZE);
  };

  useEffect(() => {
    if (!authToken || !displayedUser) return;

    reset(); // clears view items
    presenterRef.current!.reset(); // clears presenter paging
    void loadMoreItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedUser, authToken]);

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={loadMoreItems}
        hasMore={presenterRef.current!.hasMoreItems}
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
