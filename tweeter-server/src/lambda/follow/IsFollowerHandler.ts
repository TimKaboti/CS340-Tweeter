import { IsFollowerRequest } from "tweeter-shared";
import { FollowService } from "../../model/service/FollowService";

export const handler = async (event: any) => {
    try {
        if (!event.body) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ errorMessage: "Missing request body" }),
            };
        }

        const request: IsFollowerRequest = JSON.parse(event.body);

        if (!request.token || !request.userAlias || !request.selectedUserAlias) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({
                    errorMessage: "Missing token, userAlias, or selectedUserAlias",
                }),
            };
        }

        const service = new FollowService();
        const response = await service.isFollower(request);

        return {
            statusCode: 200,
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