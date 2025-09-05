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
    const response = await fetch('https://www.wagslane.dev/index.xml', {
        method: "GET",
        headers: {
            "User-Agent": "gator"
        }
    });

    console.log(typeof (response))
    const result = await response.text();

    console.log(result);

}