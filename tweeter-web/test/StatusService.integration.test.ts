// import "isomorphic-fetch";

// import { AuthToken, Status } from "tweeter-shared";
// import StatusService from "../src/service/StatusService";

// describe("StatusService integration tests", () => {
//   const statusService = new StatusService();
//   const authToken = new AuthToken("abc123", Date.now());

//   test("loadMoreStory returns a successful page of statuses", async () => {
//     const [statuses, hasMore] = await statusService.loadMoreStory(
//       authToken,
//       "@allen",
//       10,
//       null
//     );

//     expect(statuses).not.toBeNull();
//     expect(statuses.length).toBeGreaterThan(0);
//     expect(statuses[0]).toBeInstanceOf(Status);
//     expect(typeof hasMore).toBe("boolean");
//   });
// });