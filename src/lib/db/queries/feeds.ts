import { db } from "..";
import { Feed, feeds } from "../schema";
import { getUserNameById } from "./users";
import { firstOrUndefined } from "./utils";

export type FeedList = {
    name: string,
    url: string,
    userName: string
}


export async function createFeed(name: string, url: string, userId: string) {
    const result = await db.insert(feeds).values({ name: name, url: url, userId: userId }).returning();
    return firstOrUndefined(result);
}

export async function getFeeds() {
    const feedDataList: FeedList[] = [];
    const feedList = await db.select().from(feeds);

    if (!feedList)
        throw new Error('No feeds exist.')

    for (const feed of feedList) {
        const userName = await getUserNameById(feed.userId);
        if (!userName)
            throw new Error('No user exists for this feed. CRITICAL')

        feedDataList.push({
            name: feed.name,
            url: feed.url,
            userName: userName?.name
        })
    };

    return feedDataList
}