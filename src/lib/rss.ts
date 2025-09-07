import { XMLParser } from "fast-xml-parser";

export type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};

export type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};

export async function fetchFeed(feedUrl: string) {
    // TODO: finish task from boot.dev
    let itemList: RSSItem[] = [];

    const response = await fetch(feedUrl, {
        method: "GET",
        headers: {
            "User-Agent": "gator"
        }
    });

    const result = await response.text();
    const parser = new XMLParser();
    const obj = parser.parse(result);


    if (!obj.rss.channel)
        throw new Error('Channel does not exist');

    if (!obj.rss.channel.title || !obj.rss.channel.link || !obj.rss.channel.description)
        throw new Error('Metadata is missing');

    const title = obj.rss.channel.title;
    const link = obj.rss.channel.link;
    const description = obj.rss.channel.description;

    const isArray = Array.isArray(obj.rss.channel.item);

    if (!isArray)
        obj.rss.channel.item = [];

    obj.rss.channel.item.forEach((element: RSSItem) => {
        if (element.title && element.link && element.description && element.pubDate)
            itemList.push(element)
    });

    const finalResult: RSSFeed = {
        channel: {
            title: title,
            link: link,
            description: description,
            item: itemList
        }
    }

    return finalResult
}