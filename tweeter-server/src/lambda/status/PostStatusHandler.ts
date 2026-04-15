import { PostStatusRequest } from "tweeter-shared";
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

        let request: PostStatusRequest;

        try {
            request = JSON.parse(event.body);
        } catch {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ errorMessage: "Request body must be valid JSON" }),
            };
        }

        if (!request.token || !request.newStatus) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({
                    errorMessage: "Missing token or status",
                }),
            };
        }

        const service = new StatusService();
        const response = await service.postStatus(request);

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