import { RegisterRequest } from "tweeter-shared";
import { AuthService } from "../../model/service/AuthService";

export const handler = async (event: any) => {
    try {
        if (!event.body) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({ errorMessage: "Missing request body" }),
            };
        }

        const request: RegisterRequest = JSON.parse(event.body);

        if (
            !request.firstName ||
            !request.lastName ||
            !request.alias ||
            !request.password ||
            !request.imageUrl
        ) {
            return {
                statusCode: 400,
                headers: { "Access-Control-Allow-Origin": "*" },
                body: JSON.stringify({
                    errorMessage: "Missing required registration fields",
                }),
            };
        }

        const service = new AuthService();
        const response = await service.register(request);

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