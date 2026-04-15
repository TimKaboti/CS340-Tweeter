import { DAOFactory } from "../dao/factory/DAOFactory";
import { DynamoDAOFactory } from "../dao/factory/DynamoDAOFactory";

export class AuthorizationService {
    private factory: DAOFactory;

    constructor(factory: DAOFactory = new DynamoDAOFactory()) {
        this.factory = factory;
    }

    async verify(token: string | undefined): Promise<string> {
        if (!token) {
            throw new Error("Unauthorized: missing auth token");
        }

        const session = await this.factory.getAuthDAO().getSession(token);

        if (!session) {
            throw new Error("Unauthorized: invalid auth token");
        }

        return session.alias;
    }
}