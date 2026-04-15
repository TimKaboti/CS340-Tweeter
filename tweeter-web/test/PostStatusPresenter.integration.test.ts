import "isomorphic-fetch";
import { instance, mock, verify, when } from "@typestrong/ts-mockito";
import { AuthToken, User } from "tweeter-shared";

import AuthService from "../src/service/AuthService";
import StatusService from "../src/service/StatusService";
import PostStatusPresenter, {
  PostStatusView,
} from "../src/presenter/PostStatusPresenter";

describe("PostStatusPresenter integration test", () => {
  const authService = new AuthService();
  const statusService = new StatusService();

  const alias = "me3";
  const password = "me3";

  let authToken: AuthToken;
  let currentUser: User;

  let mockView: PostStatusView;
  let view: PostStatusView;

  let presenter: PostStatusPresenter;

  beforeAll(async () => {
    const [user, token] = await authService.login(alias, password);
    currentUser = user;
    authToken = token;
  }, 20000);

  beforeEach(() => {
    mockView = mock<PostStatusView>();
    view = instance(mockView);

    presenter = new PostStatusPresenter(view);

    when(mockView.showPersistentInfo("Posting status...")).thenReturn("toast-1");
  });

  test(
    "login, post through presenter, verify success message, and verify story append",
    async () => {
      const uniquePost = `integration presenter test ${Date.now()}`;

      await presenter.submitPost(uniquePost, authToken, currentUser);

      verify(mockView.showPersistentInfo("Posting status...")).once();
      verify(mockView.clearPost()).once();
      verify(mockView.dismissToast("toast-1")).once();
      verify(mockView.setLoading(false)).once();

      // Use ONE of these depending on your presenter source string.
      verify(mockView.showInfo("Status posted!", 2000)).once();

      const [statuses, hasMore] = await statusService.loadMoreStory(
        authToken,
        currentUser.alias,
        10,
        null
      );

      expect(statuses).not.toBeNull();
      expect(statuses.length).toBeGreaterThan(0);
      expect(typeof hasMore).toBe("boolean");

      const matchingStatus = statuses.find((s) => s.post === uniquePost);

      expect(matchingStatus).toBeDefined();
      expect(matchingStatus!.post).toBe(uniquePost);
      expect(matchingStatus!.user.alias).toBe(currentUser.alias);
      expect(matchingStatus!.user.firstName).toBe(currentUser.firstName);
      expect(matchingStatus!.user.lastName).toBe(currentUser.lastName);
      expect(matchingStatus!.user.imageUrl).toBe(currentUser.imageUrl);
      expect(matchingStatus!.timestamp).toBeGreaterThan(0);
    },
    20000
  );
});