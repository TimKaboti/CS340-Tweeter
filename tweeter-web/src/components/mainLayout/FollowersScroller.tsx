import UserItemScroller from "./UserItemScroller";
import FollowersPresenter from "../../presenter/FollowersPresenter";
import { UserItemView } from "../../presenter/UserItemPresenter";

const FollowersScroller = () => {
  return (
    <UserItemScroller
      featurePath="/followers"
      presenterFactory={(view: UserItemView) => new FollowersPresenter(view)}
    />
  );
};

export default FollowersScroller;
