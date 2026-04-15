import { DynamoDAOFactory } from "../dao/factory/DynamoDAOFactory";
import { PasswordUtil } from "../service/PasswordUtil";

type SeedConfig = {
    targetAlias: string;
    followerCount: number;
    followerPrefix: string;
    defaultPassword: string;
    imageUrl: string;
};

const config: SeedConfig = {
    targetAlias: "me",
    followerCount: 500, // change this: 10, 100, 500, 1000, etc.
    followerPrefix: "loadfollower",
    defaultPassword: "test123",
    imageUrl: "https://via.placeholder.com/128",
};

function normalizeAlias(alias: string): string {
    const trimmed = alias.trim();
    return trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;
}

function makeDisplayName(alias: string): { firstName: string; lastName: string } {
    return {
        firstName: alias,
        lastName: "LoadTest",
    };
}

async function main() {
    const factory = new DynamoDAOFactory();
    const userDAO = factory.getUserDAO();
    const followDAO = factory.getFollowDAO();

    const targetAlias = normalizeAlias(config.targetAlias);
    const targetUser = await userDAO.getUserByAlias(targetAlias);

    if (!targetUser) {
        throw new Error(
            `Target user '${targetAlias}' does not exist. Create that user first in the app.`
        );
    }

    console.log(`Target user found: ${targetUser.alias}`);

    const passwordHash = await PasswordUtil.hash(config.defaultPassword);

    let createdUsers = 0;
    let existingUsers = 0;
    let createdFollows = 0;
    let existingFollows = 0;

    for (let i = 1; i <= config.followerCount; i++) {
        const alias = `${config.followerPrefix}${String(i).padStart(5, "0")}`;
        const { firstName, lastName } = makeDisplayName(alias);

        const existingUser = await userDAO.getUserByAlias(alias);

        if (!existingUser) {
            await userDAO.putUser({
                alias,
                firstName,
                lastName,
                imageUrl: config.imageUrl,
                passwordHash,
            });
            createdUsers++;
        } else {
            existingUsers++;
        }

        const alreadyFollowing = await followDAO.getIsFollower(alias, targetAlias);

        if (!alreadyFollowing) {
            await followDAO.putFollow({
                followerAlias: alias,
                followeeAlias: targetAlias,
                followerDisplayName: `${firstName} ${lastName}`,
                followeeDisplayName: `${targetUser.firstName} ${targetUser.lastName}`,
                followerImageUrl: config.imageUrl,
                followeeImageUrl: targetUser.imageUrl,
            });
            createdFollows++;
        } else {
            existingFollows++;
        }

        if (i % 50 === 0 || i === config.followerCount) {
            console.log(
                `Processed ${i}/${config.followerCount} | users created: ${createdUsers}, follows created: ${createdFollows}`
            );
        }
    }

    const finalFollowerCount = await followDAO.getFollowerCount(targetAlias);

    console.log("Done.");
    console.log({
        targetAlias,
        requestedFollowers: config.followerCount,
        createdUsers,
        existingUsers,
        createdFollows,
        existingFollows,
        finalFollowerCount,
        followerPrefix: config.followerPrefix,
        defaultPassword: config.defaultPassword,
    });
}

main().catch((error) => {
    console.error("Seed script failed:", error);
    process.exit(1);
});