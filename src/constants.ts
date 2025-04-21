import type { FeedOptions } from "feed";
import { FeedType } from "./models/feed";

const year = new Date().getFullYear();

export const DefaultFeedConfig = {
  copyright: `Tous droits reservé ${year}, Médiapart`,
  language: "fr",
  image:
    "https://raw.githubusercontent.com/oriionn/mediapart-rss/main/assets/mediapart.png",
  favicon: "https://www.mediapart.fr/favicon.ico",
  generator: "https://github.com/oriionn/mediapart-rss",
};

export const NewsFeedConfig: FeedOptions = {
  id: "https://www.mediapart.fr/journal/fil-dactualites",
  title: "Médiapart - Fil d'actualité",
  description: "Flux RSS non-officiel pour Médiapart | Fil d'actualité",
  link: "https://www.mediapart.fr/journal/fil-dactualites",
  ...DefaultFeedConfig,
};

export const InvestigationFeedConfig: FeedOptions = {
  id: "https://www.mediapart.fr/journal/enquetes",
  title: "Médiapart - Enquêtes",
  description: "Flux RSS non-officiel pour Médiapart | Enquêtes",
  link: "https://www.mediapart.fr/journal/enquetes",
  ...DefaultFeedConfig,
};

export const feedConfigs = {
  [FeedType.NEWS]: NewsFeedConfig,
  [FeedType.INVESTIGATION]: InvestigationFeedConfig,
};
