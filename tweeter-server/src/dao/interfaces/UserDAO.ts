export interface UserDTO {
    firstName: string;
    lastName: string;
    alias: string;
    imageUrl: string;
    passwordHash: string;
}

export interface UserDAO {
    putUser(user: UserDTO): Promise<void>;
    getUserByAlias(alias: string): Promise<UserDTO | null>;
}