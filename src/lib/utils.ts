import type { Feed, User } from "./db/schema";
export function printFeed(feed: Feed, user: User) {
    console.log(`feed: ${feed.id}, ${feed.name}, ${feed.url}, ${feed.userId}, ${feed.createdAt}`);
    console.log(`user: ${user.id}, ${user.name}`)
}