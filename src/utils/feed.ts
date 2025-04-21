import { Feed } from "feed";
import { FeedType } from "../models/feed";
import { feedConfigs } from "../constants";
import { RSSFormat } from "../models/rss";

export const feed = (type: FeedType) => new Feed(feedConfigs[type]);

export const sendFeed = (format: RSSFormat, feed: Feed) => {
  switch (format) {
    case RSSFormat.RSS:
      return {
        contentType: "application/rss+xml",
        content: feed.rss2(),
      };
    case RSSFormat.JSON:
      return {
        contentType: "application/json",
        content: feed.json1(),
      };
    case RSSFormat.ATOM:
      return {
        contentType: "application/atom+xml",
        content: feed.atom1(),
      };
    default:
      throw new Error(`Unsupported format: ${format}`);
  }
};
