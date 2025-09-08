import { readConfig } from "src/config";
import { createFeed, createFeedFollow, getFeedByUrl, getFeedFollowsForUser, getFeeds, unfollowFeed } from "src/lib/db/queries/feeds";
import { getUser } from "src/lib/db/queries/users";
import { getUserIdFromConfig } from "src/lib/db/queries/utils";
import { User } from "src/lib/db/schema";
import { printFeed } from "src/lib/utils";

export async function handlerCreateFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 2)
        throw new Error(`usage: ${cmdName} <name> <url>`)

    const newFeed = await createFeed(args[0], args[1], user.id)

    if (!newFeed)
        throw new Error('Failed to create new Feed');

    await handlerFollow("follow", user, newFeed.url);

    printFeed(newFeed, user)
}

export async function handlerGetFeed(_: string) {
    const feeds = await getFeeds();
    for (const feed of feeds) {
        console.log(feed)
    }
}

export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
    if (!args[0])
        throw new Error(`usage: <${cmdName}> <url>`)
    const feedUrl = args[0];

    const feed = await getFeedByUrl(feedUrl);
    if (!feed)
        throw new Error("Feed does'nt exist")

    const feedFollow = await createFeedFollow(user.id, feed.id)
    if (!feedFollow)
        throw new Error("Feed Following failed.")

    console.log(feedFollow);
}

export async function handlerFollowing(_: string, user: User) {
    const following = await getFeedFollowsForUser(user.id);

    console.log(following);
}


export async function handlerUnfollow(_: string, user: User, ...args: string[]) {
    const feed = await getFeedByUrl(args[0])
    if (!feed)
        throw new Error('Feed is not existent.')

    await unfollowFeed(user, feed);
}