import { Status } from "tweeter-shared";
import StatusService from "../service/StatusService";
import PagedItemPresenter, { PagedItemView } from "./PagedItemPresenter";

export type StatusItemView = PagedItemView<Status>;

export default abstract class StatusItemPresenter extends PagedItemPresenter<Status> {
  protected service = new StatusService();

  protected constructor(view: StatusItemView) {
    super(view);
  }
}