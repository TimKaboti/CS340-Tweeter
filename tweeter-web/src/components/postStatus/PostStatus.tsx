import "./PostStatus.css";
import { useRef, useState, useContext } from "react";
import { UserInfoContext } from "../userInfo/UserInfoContexts";
import { ToastActionsContext } from "../toaster/ToastContexts";
import { ToastType } from "../toaster/Toast";
import PostStatusPresenter, { PostStatusView } from "../../presenter/PostStatusPresenter";

const PostStatus = () => {
  const { displayToast, deleteToast } = useContext(ToastActionsContext);
  const { currentUser, authToken } = useContext(UserInfoContext);

  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const listener: PostStatusView = {
    setLoading: (loading: boolean) => setIsLoading(loading),
    clearPost: () => setPost(""),
    showInfo: (message: string, durationMs: number) =>
      displayToast(ToastType.Info, message, durationMs),
    showError: (message: string, durationMs: number) =>
      displayToast(ToastType.Error, message, durationMs),
    showPersistentInfo: (message: string) => displayToast(ToastType.Info, message, 0),
    dismissToast: (id: string) => deleteToast(id),
  };

  const presenterRef = useRef<PostStatusPresenter | null>(null);
  if (!presenterRef.current) {
    presenterRef.current = new PostStatusPresenter(listener);
  }

  const submitPost = async (event: React.MouseEvent) => {
    event.preventDefault();
    if (!authToken || !currentUser) return;

    await presenterRef.current!.submitPost(post, authToken, currentUser);
  };

  const clearPost = (event: React.MouseEvent) => {
    event.preventDefault();
    setPost("");
  };

  const isDisabled = () =>
    !presenterRef.current!.canPost(post, authToken ?? null, currentUser ?? null);

  return (
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
          rows={10}
          placeholder="What's on your mind?"
          value={post}
          onChange={(event) => setPost(event.target.value)}
        />
      </div>

      <div className="form-group">
        <button
          id="postStatusButton"
          className="btn btn-md btn-primary me-1"
          type="button"
          disabled={isDisabled()}
          style={{ width: "8em" }}
          onClick={submitPost}
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <div>Post Status</div>
          )}
        </button>

        <button
          id="clearStatusButton"
          className="btn btn-md btn-secondary"
          type="button"
          disabled={isDisabled()}
          onClick={clearPost}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default PostStatus;
