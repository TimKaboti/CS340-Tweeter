import { RegisterRequest } from "tweeter-shared";
import { AuthService } from "../../service/AuthService";

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
        console.log("REGISTER REQUEST:", request);
        console.log("FIELD CHECKS:", {
            firstName: !!request.firstName,
            lastName: !!request.lastName,
            alias: !!request.alias,
            password: !!request.password,
            userImageBase64: !!request.userImageBase64,
            userImageBase64Length: request.userImageBase64?.length,
        });

        if (
            !request.firstName ||
            !request.lastName ||
            !request.alias ||
            !request.password ||
            !request.userImageBase64
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