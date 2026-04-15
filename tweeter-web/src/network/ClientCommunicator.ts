import { TweeterRequest, TweeterResponse } from "tweeter-shared";

export class ClientCommunicator {
    private SERVER_URL: string;

    public constructor(serverUrl: string) {
        this.SERVER_URL = serverUrl;
    }

    public async doPost<REQ extends TweeterRequest, RES extends TweeterResponse>(
        req: REQ | undefined,
        endpoint: string,
        headers?: Headers
    ): Promise<RES> {
        if (headers && req) {
            headers.append("Content-type", "application/json");
        } else if (req) {
            headers = new Headers({
                "Content-type": "application/json",
            });
        }

        const url = this.getUrl(endpoint);
        const params = this.getParams(
            "POST",
            headers,
            req ? JSON.stringify(req) : undefined
        );

        console.log("POST REQUEST", {
            url,
            request: req,
        });

        try {
            const resp: Response = await fetch(url, params);

            if (resp.ok) {
                const response: RES = await resp.json();
                return response;
            } else {
                const error = await resp.json();
                throw new Error(error.errorMessage ?? error.message ?? "Request failed");
            }
        } catch (error) {
            throw new Error(
                `Client communicator POST failed: ${(error as Error).message}`
            );
        }
    }

    private getUrl(endpoint: string): string {
        return this.SERVER_URL + endpoint;
    }

    private getParams(
        method: string,
        headers?: Headers,
        body?: BodyInit
    ): RequestInit {
        const params: RequestInit = { method };

        if (headers) {
            params.headers = headers;
        }

        if (body) {
            params.body = body;
        }

        return params;
    }
}