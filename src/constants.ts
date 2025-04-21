import { FeedOptions } from "feed";

const year = new Date().getFullYear();

export const NewsFeedConfig: FeedOptions = {
  id: "https://www.mediapart.fr/journal/fil-dactualites",
  title: "Médiapart - Fil d'actualité",
  description: "Flux RSS non-officiel pour Médiapart | Fil d'actualité",
  link: "https://www.mediapart.fr/journal/fil-dactualites",
  copyright: `Tous droits reservé ${year}, Médiapart`,
  language: "fr",
  image: "https://",
};
