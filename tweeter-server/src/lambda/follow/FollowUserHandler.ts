import { FollowActionRequest } from "tweeter-shared";
import { FollowService } from "../../service/FollowService";

export const handler = async (event: any) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ errorMessage: "Missing request body" }),
      };
    }

    const request: FollowActionRequest = JSON.parse(event.body);

    if (!request.token || !request.targetUserAlias) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          errorMessage: "Missing token or targetUserAlias",
        }),
      };
    }

    const service = new FollowService();
    const response = await service.follow(request);

    return {
      statusCode: response.success ? 200 : 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(response),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        errorMessage: (e as Error).message || "Internal server error",
      }),
    };
  }
};