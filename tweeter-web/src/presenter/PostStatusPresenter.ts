import { AuthToken, Status, User } from "tweeter-shared";
import StatusService from "../service/StatusService";

export interface PostStatusView {
  setLoading(isLoading: boolean): void;
  clearPost(): void;
  showInfo(message: string, durationMs: number): void;
  showError(message: string, durationMs: number): void;
  showPersistentInfo(message: string): string; // returns toast id
  dismissToast(id: string): void;
}

export default class PostStatusPresenter {
  private view: PostStatusView;
  private service: StatusService;

  public constructor(view: PostStatusView) {
    this.view = view;
    this.service = new StatusService();
  }

  public canPost(postText: string, authToken: AuthToken | null, currentUser: User | null): boolean {
    return !!postText.trim() && !!authToken && !!currentUser;
  }

  public async submitPost(postText: string, authToken: AuthToken, currentUser: User): Promise<void> {
    let toastId = "";

    try {
      this.view.setLoading(true);
      toastId = this.view.showPersistentInfo("Posting status...");

      const status = new Status(postText, currentUser, Date.now());
      await this.service.postStatus(authToken, status);

      this.view.clearPost();
      this.view.showInfo("Status posted!", 2000);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      this.view.showError(`Failed to post the status because of exception: ${msg}`, 0);
    } finally {
      if (toastId) this.view.dismissToast(toastId);
      this.view.setLoading(false);
    }
  }
}
