import { Status } from "tweeter-shared";
import StatusService from "../service/StatusService";
import PagedItemPresenter, { PagedItemView } from "./PagedItemPresenter";

export default abstract class StatusItemPresenter extends PagedItemPresenter<Status> {
  protected service: StatusService;

  public constructor(view: PagedItemView<Status>) {
    super(view);
    this.service = new StatusService();
  }
}