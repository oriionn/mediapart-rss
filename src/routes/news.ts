import { feed, sendFeed } from "../utils/feed";
import { FeedType } from "../models/feed";
import { Elysia, t } from "elysia";
import * as cheerio from "cheerio";
import { RSSFormat } from "../models/rss";
import { fetchItems } from "../utils/request";

export default new Elysia({ prefix: "/news" }).get(
  "/",
  async ({ set, query }) => {
    let newsFeed = feed(FeedType.NEWS);

    let { items, $perPage } = await fetchItems(
      "https://www.mediapart.fr/journal/fil-dactualites",
      query.items,
      ".news__list__content .block",
    );

    for (let itemRaw of items.slice(0, query.items)) {
      let item = itemRaw.item;
      // @ts-ignore
      let $ = $perPage[itemRaw.page];

      let title = $(item).find(".teaser__title a").text();
      let description = $(item).find(".teaser__body").text();
      let author = $(item).find(".teaser__signature__author").text();
      let time = $(item).find("time.teaser__timestamp").attr("datetime");
      let link = $(item).find(".teaser__title a").attr("href");

      if (!title || !description || !author || !time || !link) continue;

      title = title.replace(/^\n+|\n+$/g, "").trim();
      description = description.replace(/^\n+|\n+$/g, "").trim();
      author = author.replace(/^\n+|\n+$/g, "").trim();

      newsFeed.addItem({
        title,
        description,
        author: [
          {
            name: author,
          },
        ],
        date: new Date(time),
        link: `https//mediapart.fr${link}`,
      });
    }

    let d = sendFeed(query.format, newsFeed);

    set.headers = {
      "Content-Type": d.contentType,
    };
    return d.content;
  },
  {
    query: t.Object({
      items: t.Number({ default: 10, min: 1 }),
      format: t.Enum(RSSFormat, { default: RSSFormat.RSS }),
    }),
  },
);
