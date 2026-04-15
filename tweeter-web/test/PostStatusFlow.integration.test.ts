import "isomorphic-fetch";

import { AuthToken, Status, User } from "tweeter-shared";
import AuthService from "../src/service/AuthService";
import StatusService from "../src/service/StatusService";

describe("Post status flow integration test", () => {
    const authService = new AuthService();
    const statusService = new StatusService();

    const alias = "me3";
    const password = "me3";

    let authToken: AuthToken;
    let currentUser: User;

    beforeAll(async () => {
        const [user, token] = await authService.login(alias, password);
        currentUser = user;
        authToken = token;
    }, 20000);

    test(
        "login, post status, and verify it appears in story",
        async () => {
            const uniquePost = `integration test ${Date.now()}`;

            const status = new Status(
                `test-id-${Date.now()}`,
                uniquePost,
                currentUser,
                Date.now()
            );

            await statusService.postStatus(authToken, status);

            const [statuses, hasMore] = await statusService.loadMoreStory(
                authToken,
                currentUser.alias,
                10,
                null
            );

            expect(statuses).not.toBeNull();
            expect(statuses.length).toBeGreaterThan(0);
            expect(typeof hasMore).toBe("boolean");

            const found = statuses.some((s) => s.post === uniquePost);
            expect(found).toBe(true);
        },
        20000
    );
});