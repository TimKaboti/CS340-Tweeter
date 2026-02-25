import { AuthToken, Status } from "tweeter-shared";
import StatusItemPresenter from "./StatusItemPresenter";

export default class StoryPresenter extends StatusItemPresenter {
  protected itemDescription(): string {
    return "load story items";
  }

  protected async getMoreItems(
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> {
    return this.service.loadMoreStory(authToken, userAlias, pageSize, lastItem);
  }
}