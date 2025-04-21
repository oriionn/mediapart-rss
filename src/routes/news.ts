import { feed } from "../utils/feed";
import { FeedType } from "../models/feed";
import { Elysia, t } from "elysia";
import * as cheerio from "cheerio";
import { RSSFormat } from "../models/rss";

export default new Elysia({ prefix: "/news" }).get(
  "/",
  async ({ set, query }) => {
    let newsFeed = feed(FeedType.NEWS);

    let items = [];
    const $perPage = {};

    let page = 1;
    while (items.length < query.items) {
      let req = await fetch(
        `https://www.mediapart.fr/journal/fil-dactualites?page=${page}`,
      );
      if (!req.ok && page === 1) throw new Error(`Failed to fetch news feed`);
      if (!req.ok && page > 1) continue;
      let html = await req.text();

      let $ = cheerio.load(html);
      let pageItemsRaw = $(".news__list__content .block");
      let pageItems = pageItemsRaw.map((index, item) => ({ page, item }));
      // @ts-ignore
      $perPage[page] = $;

      items.push(...pageItems);

      page++;
    }

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

    let format = query.format;
    switch (format) {
      case RSSFormat.JSON:
        set.headers = {
          "Content-Type": "application/json",
        };
        return newsFeed.json1();
      case RSSFormat.RSS:
        set.headers = {
          "Content-Type": "application/rss+xml",
        };
        return newsFeed.rss2();
      default:
        set.headers = {
          "Content-Type": "application/atom+xml",
        };
        return newsFeed.atom1();
    }
  },
  {
    query: t.Object({
      items: t.Number({ default: 10, min: 1 }),
      format: t.Enum(RSSFormat, { default: RSSFormat.ATOM }),
    }),
  },
);
