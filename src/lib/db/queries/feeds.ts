import { db } from "..";
import { and, eq } from "drizzle-orm";
import { Feed, feedFollows, feeds, User, users } from "../schema";
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

export async function createFeedFollow(userId: string, feedId: string) {
    const [newFeedFollow] = await db.insert(feedFollows).values({ userId: userId, feedId: feedId }).returning();
    const result = await db.select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        userId: feedFollows.userId,
        feedId: feedFollows.feedId,
        userName: users.name,
        feedName: feeds.name
    })
        .from(feedFollows)
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .where(eq(feedFollows.id, newFeedFollow.id))

    return firstOrUndefined(result);
}

export async function getFeedByUrl(url: string) {
    const result = await db.select().from(feeds).where(eq(feeds.url, url))
    return firstOrUndefined(result);
}

export async function getFeedFollowsForUser(userId: string) {
    const result = db.select({
        id: feedFollows.id,
        createdAt: feedFollows.createdAt,
        updatedAt: feedFollows.updatedAt,
        userId: feedFollows.userId,
        feedId: feedFollows.feedId,
        userName: users.name,
        feedName: feeds.name
    })
        .from(feedFollows)
        .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
        .innerJoin(users, eq(feedFollows.userId, users.id))
        .where(eq(feedFollows.userId, userId))
    return result
}

export async function unfollowFeed(user: User, feed: Feed) {
    const result = await db.delete(feedFollows)
        .where(
            and(
                eq(feedFollows.userId, user.id),
                eq(feedFollows.feedId, feed.id)
            ));
    return firstOrUndefined(result)
}