// import { useEffect, useRef } from "react";
// import InfiniteScroll from "react-infinite-scroll-component";
// import { AuthToken, User } from "tweeter-shared";

// import UserItem from "../userItem/UserItem";

// import useMessageList from "../../hooks/useMessageList";
// import useUserInfo from "../../hooks/useUserInfo";
// import useUserNavigation from "../../hooks/useUserNavigation";
// import UserItemPresenter, { UserItemView } from "../../presenter/UserItemPresenter";

// export const PAGE_SIZE = 10;

// interface Props {
//   featurePath: "/followers" | "/followees";
//   presenterFactory: (view: UserItemView) => UserItemPresenter;
// }

// const UserItemScroller = ({ featurePath, presenterFactory }: Props) => {
//   const { displayedUser, authToken } = useUserInfo();
//   const { navigateToUser } = useUserNavigation(featurePath);

//   // Only keep "visual" state in the view layer
//   const { items, addItems, reset } = useMessageList<User>();

//   // Observer/listener object (implements the view interface)
//   const listener: UserItemView = {
//     addItems: (newUsers: User[]) => {
//       addItems(newUsers);
//     },
//     displayErrorMessage: (message: string) => {
//       // Replace this with your toast system if you want
//       console.error(message);
//       alert(message);
//     },
//   };

//   // Presenter must persist across rerenders (video’s infinite-scroll bug fix)
//   const presenterRef = useRef<UserItemPresenter | null>(null);
//   if (!presenterRef.current) {
//     presenterRef.current = presenterFactory(listener);
//   }

//   const loadMore = async () => {
//     if (!authToken || !displayedUser) return;
//     await presenterRef.current!.loadMoreItems(authToken, displayedUser.alias, PAGE_SIZE);
//   };

//   useEffect(() => {
//     if (!authToken || !displayedUser) return;

//     // reset view state
//     reset();

//     // reset presenter paging state
//     presenterRef.current!.reset();

//     // load first page
//     void loadMore();

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [displayedUser, authToken]);

//   return (
//     <div className="container px-0 overflow-visible vh-100">
//       <InfiniteScroll
//         className="pr-0 mr-0"
//         dataLength={items.length}
//         next={loadMore}
//         hasMore={presenterRef.current!.hasMoreItems}
//         loader={<h4>Loading...</h4>}
//       >
//         {items.map((item, index) => (
//           <div key={index} className="row mb-3 mx-0 px-0 border rounded bg-white">
//             <UserItem user={item} featurePath={featurePath} />
//           </div>
//         ))}
//       </InfiniteScroll>
//     </div>
//   );
// };

// export default UserItemScroller;
