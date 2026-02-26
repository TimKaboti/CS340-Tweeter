import { anything, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";
import { AuthToken, User } from "tweeter-shared";

import PostStatusPresenter, { PostStatusView } from "../src/presenter/PostStatusPresenter";
import StatusService from "../src/service/StatusService";

describe("PostStatusPresenter", () => {
  let mockView: PostStatusView;
  let view: PostStatusView;

  let mockService: StatusService;
  let service: StatusService;

  let presenterSpy: PostStatusPresenter;
  let presenter: PostStatusPresenter;

  const authToken = new AuthToken("token", Date.now());
  const currentUser = new User("Bob", "Barker", "@bob", "img");
  const postText = "Hello world";

  beforeEach(() => {
    mockView = mock<PostStatusView>();
    view = instance(mockView);

    mockService = mock<StatusService>();
    service = instance(mockService);

    presenterSpy = spy(new PostStatusPresenter(view));
    presenter = instance(presenterSpy);

    when((presenterSpy as any).statusService).thenReturn(service);

    when(mockView.showPersistentInfo("Posting status...")).thenReturn("toast-1");
  });

  it("The presenter tells the view to display a posting status message.", async () => {
    await presenter.submitPost(postText, authToken, currentUser);
    verify(mockView.showPersistentInfo("Posting status...")).once();
  });

  it("The presenter calls postStatus on the service with the correct status string and auth token.", async () => {
    await presenter.submitPost(postText, authToken, currentUser);

    verify(mockService.postStatus(authToken, anything())).once();
  });

  it("When posting is successful, the presenter clears the post and displays a status posted message.", async () => {
    await presenter.submitPost(postText, authToken, currentUser);

    verify(mockView.clearPost()).once();
    verify(mockView.showInfo("Status posted!", 2000)).once();

    verify(mockView.dismissToast("toast-1")).once();
    verify(mockView.setLoading(false)).once();
  });

  it("When posting is not successful, the presenter clears the info message and displays an error but does not clear post or show status posted.", async () => {
    when(mockService.postStatus(anything(), anything())).thenThrow(new Error("boom"));

    await presenter.submitPost(postText, authToken, currentUser);

    verify(mockView.showError("Failed to post the status because of exception: boom", 0)).once();

    verify(mockView.clearPost()).never();
    verify(mockView.showInfo("Status posted!", anything())).never();

    verify(mockView.dismissToast("toast-1")).once();
    verify(mockView.setLoading(false)).once();
  });
});