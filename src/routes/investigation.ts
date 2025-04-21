import { Elysia, t } from "elysia";
import { feed } from "../utils/feed";
import { FeedType } from "../models/feed";
import * as cheerio from "cheerio";
import { RSSFormat } from "../models/rss";
import { fetchItems } from "../utils/request";
import { sendFeed } from "../utils/feed";

export default new Elysia({ prefix: "/investigation" }).get(
  "/",
  async ({ set, query }) => {
    let investFeed = feed(FeedType.INVESTIGATION);

    let req = await fetch(`https://www.mediapart.fr/journal/enquetes`);
    if (!req.ok) throw new Error(`Failed to fetch data`);
    let html = await req.text();
    let $ = cheerio.load(html);

    let firstItemsRaw = $(".news__list__content").first().find(".teaser");

    let firstItems = firstItemsRaw.map((_, item) => ({
      item,
      page: 0,
    }));

    let { items, $perPage } = await fetchItems(
      `https://www.mediapart.fr/journal/enquetes`,
      query.items,
      "ul.news__list__content .teaser",
      // @ts-ignore
      firstItems,
    );

    // @ts-ignore
    $perPage[0] = $;

    console.log(items.length);
    for (let itemRaw of items.slice(0, query.items)) {
      let item = itemRaw.item;
      // @ts-ignore
      let $ = $perPage[itemRaw.page];

      let title = $(item).find(".teaser__title a").text();
      let description = $(item).find(".teaser__body").text();
      let author = $(item).find(".teaser__signature__author").text();
      let time = $(item).find("time.teaser__datetime").attr("datetime");
      let link = $(item).find(".teaser__title a").attr("href");
      let image = $(item).find("img.media-container__media").attr("src");

      if (!title || !description || !author || !link) continue;

      title = title.replace(/^\n+|\n+$/g, "").trim();
      description = description.replace(/^\n+|\n+$/g, "").trim();
      author = author.replace(/^\n+|\n+$/g, "").trim();

      if (!time) {
        let t = link.split("/")[3];
        if (!t) time = new Date();
        else {
          t = t.match(/.{2}/g);
          if (t.length === 3) {
            // Format: DD-MM-YY
            let year = new Date().getFullYear().toString().split("");
            if (!year[0] || !year[1]) time = new Date();
            else
              time = new Date(
                parseInt(year[0] + year[1] + t[2], 10),
                parseInt(t[1], 10) - 1,
                parseInt(t[0], 10),
              );
          } else {
            time = new Date();
          }
        }
      } else {
        time = new Date(time);
      }

      investFeed.addItem({
        title,
        description,
        author: [
          {
            name: author,
          },
        ],
        date: time,
        link: `https//mediapart.fr${link}`,
      });
    }

    let d = sendFeed(query.format, investFeed);
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
