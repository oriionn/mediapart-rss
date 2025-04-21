import { Feed } from "feed";
import { FeedType } from "../models/feed";
import { feedConfigs } from "../constants";

export const feed = (type: FeedType) => new Feed(feedConfigs[type]);
