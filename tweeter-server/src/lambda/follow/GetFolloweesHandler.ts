import { PagedUserItemRequest } from "tweeter-shared";
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

        const request: PagedUserItemRequest = JSON.parse(event.body);
        console.log("GET_FOLLOWEES_HANDLER_RUNNING", request);
        
        if (!request.token || !request.userAlias || !request.pageSize) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({
                    errorMessage: "Missing required followee fields",
                }),
            };
        }

        const service = new FollowService();
        const response = await service.getFollowees(request);

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