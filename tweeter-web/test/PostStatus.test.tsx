import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthToken, User } from "tweeter-shared";

import PostStatus from "../src/components/postStatus/PostStatus";
import { UserInfoContext } from "../src/components/userInfo/UserInfoContexts";
import { ToastActionsContext } from "../src/components/toaster/ToastContexts";

// ✅ Mock the presenter class module default export
const submitPostMock = jest.fn();
const canPostMock = jest.fn();

jest.mock("../src/presenter/PostStatusPresenter", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      submitPost: submitPostMock,
      canPost: canPostMock,
    })),
  };
});

describe("PostStatus Component", () => {
  const mockUser = new User("Bob", "Barker", "@bob", "img");
  const mockAuthToken = new AuthToken("token", Date.now());

  const mockDisplayToast = jest.fn();
  const mockDeleteToast = jest.fn();

  const renderWithProviders = () => {
    return render(
      <ToastActionsContext.Provider
        value={{ displayToast: mockDisplayToast, deleteToast: mockDeleteToast, displayExistingToast: jest.fn(),
            deleteAllToasts: jest.fn() }}
      >
        <UserInfoContext.Provider
          value={{ currentUser: mockUser, displayedUser: mockUser, authToken: mockAuthToken }}
        >
          <PostStatus />
        </UserInfoContext.Provider>
      </ToastActionsContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Component uses presenter.canPost(...) to decide disabled state
    canPostMock.mockImplementation((postText: string) => postText.trim().length > 0);
  });

  it("When first rendered the Post Status and Clear buttons are both disabled.", () => {
    // If textarea is empty, canPost should return false
    canPostMock.mockReturnValue(false);

    renderWithProviders();

    const postBtn = screen.getByRole("button", { name: /post status/i });
    const clearBtn = screen.getByRole("button", { name: /clear/i });

    expect(postBtn).toBeDisabled();
    expect(clearBtn).toBeDisabled();
  });

  it("Both buttons are enabled when the text field has text.", async () => {
    const user = userEvent.setup();
    renderWithProviders();

    const textarea = screen.getByPlaceholderText(/what's on your mind\?/i);
    await user.type(textarea, "hi");

    const postBtn = screen.getByRole("button", { name: /post status/i });
    const clearBtn = screen.getByRole("button", { name: /clear/i });

    expect(postBtn).toBeEnabled();
    expect(clearBtn).toBeEnabled();
  });

  it("Both buttons are disabled when the text field is cleared.", async () => {
    const user = userEvent.setup();
    renderWithProviders();

    const textarea = screen.getByPlaceholderText(/what's on your mind\?/i);
    await user.type(textarea, "hi");

    let postBtn = screen.getByRole("button", { name: /post status/i });
    let clearBtn = screen.getByRole("button", { name: /clear/i });

    expect(postBtn).toBeEnabled();
    expect(clearBtn).toBeEnabled();

    await user.clear(textarea);

    postBtn = screen.getByRole("button", { name: /post status/i });
    clearBtn = screen.getByRole("button", { name: /clear/i });

    expect(postBtn).toBeDisabled();
    expect(clearBtn).toBeDisabled();
  });

  it("The presenter's submitPost method is called with correct parameters when the Post Status button is pressed.", async () => {
    const user = userEvent.setup();
    renderWithProviders();

    const textarea = screen.getByPlaceholderText(/what's on your mind\?/i);
    await user.type(textarea, "hello there");

    const postBtn = screen.getByRole("button", { name: /post status/i });
    await user.click(postBtn);

    expect(submitPostMock).toHaveBeenCalledTimes(1);
    expect(submitPostMock).toHaveBeenCalledWith("hello there", mockAuthToken, mockUser);
  });
});