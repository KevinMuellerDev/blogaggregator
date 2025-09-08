import { readConfig } from "src/config";
import { getUser } from "./users";

export function firstOrUndefined<T>(items: T[]) {
    if (items.length === 0) {
        return;
    }
    return items[0];
}

export async function getUserIdFromConfig() {
    const config = readConfig();
    if (!config.currentUserName)
        throw new Error('no Current user set.')
    const currentUserData = await getUser(config.currentUserName);

    if (!currentUserData)
        throw new Error('No current User Data.')

    return currentUserData.id
}