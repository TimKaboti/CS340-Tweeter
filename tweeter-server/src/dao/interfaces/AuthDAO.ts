export interface SessionDTO {
    token: string;
    alias: string;
    timestamp: number;
}

export interface AuthDAO {
    createSession(session: SessionDTO): Promise<void>;
    getSession(token: string): Promise<SessionDTO | null>;
    deleteSession(token: string): Promise<void>;
}