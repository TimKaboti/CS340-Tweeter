import { CountRequest } from "tweeter-shared";
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

        const request: CountRequest = JSON.parse(event.body);

        if (!request.token || !request.userAlias) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({
                    errorMessage: "Missing token or userAlias",
                }),
            };
        }

        const service = new FollowService();
        const response = await service.getFolloweeCount(request);

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