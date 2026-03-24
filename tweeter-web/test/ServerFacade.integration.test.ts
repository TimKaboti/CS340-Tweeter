import "isomorphic-fetch";

import {
  CountRequest,
  PagedUserItemRequest,
  RegisterRequest,
  User,
} from "tweeter-shared";
import { ServerFacade } from "../src/network/ServerFacade";

describe("ServerFacade integration tests", () => {
  const serverFacade = new ServerFacade();

  test("register returns the registered user data and an auth token", async () => {
  const request = new RegisterRequest(
    "Ty",
    "Tanner",
    "@ty",
    "password",
    "https://picsum.photos/200"
  );

  const [user, authToken] = await serverFacade.register(request);

  expect(user).not.toBeNull();
  expect(authToken).not.toBeNull();

  expect(user.firstName).toBe("Ty");
  expect(user.lastName).toBe("Tanner");
  expect(user.alias).toBe("@ty");

  expect(authToken.token).toBeDefined();
  expect(authToken.token.length).toBeGreaterThan(0);
});

  test("getMoreFollowers returns at least one follower", async () => {
    const request = new PagedUserItemRequest(
      "abc123",
      "@allen",
      10,
      null
    );

    const [followers, hasMore] = await serverFacade.getMoreFollowers(request);

    expect(followers).not.toBeNull();
    expect(followers.length).toBeGreaterThan(0);
    expect(followers[0]).toBeInstanceOf(User);
    expect(typeof hasMore).toBe("boolean");
  });

  test("getFolloweeCount returns a value greater than zero", async () => {
    const request = new CountRequest("abc123", "@allen");

    const count = await serverFacade.getFolloweeCount(request);

    expect(count).toBeGreaterThan(0);
  });
});