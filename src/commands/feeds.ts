import { readConfig } from "src/config";
import { createFeed, getFeeds } from "src/lib/db/queries/feeds";
import { getUser, getUserNameById } from "src/lib/db/queries/users";
import { printFeed } from "src/lib/utils";

export async function handlerCreateFeed(cmdName: string, ...args: string[]) {
    if (args.length !== 2)
        throw new Error(`usage: ${cmdName} <name> <url>`)

    const config = readConfig();
    if (!config.currentUserName)
        throw new Error('no Current user set.')
    const currentUserData = await getUser(config.currentUserName);

    if (!currentUserData)
        throw new Error('No current User Data.')

    const currentUuid = currentUserData.id

    const newFeed = await createFeed(args[0], args[1], currentUuid)

    if (!newFeed)
        throw new Error('Failed to create new Feed');

    printFeed(newFeed, currentUserData!)
}

export async function handlerGetFeed(_: string) {
    const feeds = await getFeeds();
    for (const feed of feeds) {
        console.log(feed)
    }
}