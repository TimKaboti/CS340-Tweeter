import { User } from "tweeter-shared";
import FollowService from "../service/FollowService";
import PagedItemPresenter, { PagedItemView } from "./PagedItemPresenter";

export default abstract class UserItemPresenter extends PagedItemPresenter<User> {
  protected service: FollowService;

  public constructor(view: PagedItemView<User>) {
    super(view);
    this.service = new FollowService();
  }
}