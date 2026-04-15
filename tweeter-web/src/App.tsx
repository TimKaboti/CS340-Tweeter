import "./App.css";
import { useContext } from "react";
import { UserInfoContext } from "./components/userInfo/UserInfoContexts";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import ItemScroller from "./components/mainLayout/ItemScroller";
import FolloweesPresenter from "./presenter/FolloweesPresenter";
import FollowersPresenter from "./presenter/FollowersPresenter";
import FeedPresenter from "./presenter/FeedPresenter";
import StoryPresenter from "./presenter/StoryPresenter";
import { User, Status } from "tweeter-shared";
import PagedItemPresenter, {
  PagedItemView,
} from "./presenter/PagedItemPresenter";
import UserItem from "./components/userItem/UserItem";
import StatusItem from "./components/statusItem/StatusItem";
import useUserNavigation from "./hooks/useUserNavigation";

const userItemComponentGenerator = (featurePath: string) => (user: User) =>
  <UserItem user={user} featurePath={featurePath} />;

type FeaturePath = "/feed" | "/story" | "/followers" | "/followees";

/**
 * Clicking a user in a status should always take the app to that user's story,
 * not to /feed/:alias. A feed route is for the logged-in user's feed, while a
 * user's story/profile route is the right place to navigate when selecting a user.
 */
const statusItemComponentGenerator =
  (
    featurePath: FeaturePath,
    onNavigateToUser: (e: React.MouseEvent) => Promise<void>
  ) =>
    (status: Status) =>
    (
      <StatusItem
        status={status}
        linkTo={`/story/${status.user.alias}`}
        featurePath={featurePath}
        onNavigateToUser={onNavigateToUser}
      />
    );

const followeesPresenterFactory = (
  view: PagedItemView<User>
): PagedItemPresenter<User> => new FolloweesPresenter(view as any);

const followersPresenterFactory = (
  view: PagedItemView<User>
): PagedItemPresenter<User> => new FollowersPresenter(view as any);

const feedPresenterFactory = (
  view: PagedItemView<Status>
): PagedItemPresenter<Status> => new FeedPresenter(view as any);

const storyPresenterFactory = (
  view: PagedItemView<Status>
): PagedItemPresenter<Status> => new StoryPresenter(view as any);

const App = () => {
  const { currentUser, authToken } = useContext(UserInfoContext);

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const PAGE_SIZE = 10;

const FeedRoute = () => {
  const { authToken } = useContext(UserInfoContext);
  const { displayedUser } = useParams();

  const { navigateToUser } = useUserNavigation("/story");

  return (
    <ItemScroller<Status>
      authToken={authToken!}
      userOrAlias={displayedUser!}
      pageSize={PAGE_SIZE}
      presenterFactory={feedPresenterFactory}
      itemComponentGenerator={statusItemComponentGenerator(
        "/feed",
        navigateToUser
      )}
    />
  );
};

const StoryRoute = () => {
  const { authToken } = useContext(UserInfoContext);
  const { displayedUser } = useParams();

  const { navigateToUser } = useUserNavigation("/story");

  return (
    <ItemScroller<Status>
      authToken={authToken!}
      userOrAlias={displayedUser!}
      pageSize={PAGE_SIZE}
      presenterFactory={storyPresenterFactory}
      itemComponentGenerator={statusItemComponentGenerator(
        "/story",
        navigateToUser
      )}
    />
  );
};

const FolloweesRoute = () => {
  const { authToken } = useContext(UserInfoContext);
  const { displayedUser } = useParams();

  return (
    <ItemScroller<User>
      authToken={authToken!}
      userOrAlias={displayedUser!}
      pageSize={PAGE_SIZE}
      presenterFactory={followeesPresenterFactory}
      itemComponentGenerator={userItemComponentGenerator("/followees")}
    />
  );
};

const FollowersRoute = () => {
  const { authToken } = useContext(UserInfoContext);
  const { displayedUser } = useParams();

  return (
    <ItemScroller<User>
      authToken={authToken!}
      userOrAlias={displayedUser!}
      pageSize={PAGE_SIZE}
      presenterFactory={followersPresenterFactory}
      itemComponentGenerator={userItemComponentGenerator("/followers")}
    />
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useContext(UserInfoContext);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />

        <Route path="feed/:displayedUser" element={<FeedRoute />} />
        <Route path="story/:displayedUser" element={<StoryRoute />} />
        <Route path="followees/:displayedUser" element={<FolloweesRoute />} />
        <Route path="followers/:displayedUser" element={<FollowersRoute />} />

        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;