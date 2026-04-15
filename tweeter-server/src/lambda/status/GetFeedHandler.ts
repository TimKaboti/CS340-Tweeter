import { PagedStatusItemRequest } from "tweeter-shared";
import { StatusService } from "../../service/StatusService";

export const handler = async (event: any) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({ errorMessage: "Missing request body" }),
      };
    }

    const request: PagedStatusItemRequest = JSON.parse(event.body);

    if (!request.token || !request.userAlias || !request.pageSize) {
      return {
        statusCode: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
        body: JSON.stringify({
          errorMessage: "Missing required feed fields",
        }),
      };
    }

    const service = new StatusService();
    const response = await service.getFeed(request);

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