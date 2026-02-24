import { User, AuthToken } from "tweeter-shared";
import FollowService from "../service/FollowService";
import PagedItemPresenter, { PagedItemView } from "./PagedItemPresenter";

export type UserItemView = PagedItemView<User>;

export default abstract class UserItemPresenter extends PagedItemPresenter<User> {
  protected followService = new FollowService();

  protected constructor(view: UserItemView) {
    super(view);
  }
}