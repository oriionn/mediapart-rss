import * as cheerio from "cheerio";

const PAGE_LIMIT = parseInt(process.env.PAGE_LIMIT || "5");

export async function fetchItems(
  url: string,
  items: number,
  classs: string,
  firstItems?: any[],
) {
  let itemList: any[] = [];
  if (firstItems) {
    itemList = [...firstItems];
  }
  let $perPage = {};
  let page = 1;

  while (itemList.length < items && page <= PAGE_LIMIT) {
    const req = await fetch(`${url}?page=${page}`);
    if (!req.ok && page === 1) throw new Error(`Failed to fetch news feed`);
    if (!req.ok && page > 1) continue;

    let html = await req.text();
    let $ = cheerio.load(html);
    let pageItemsRaw = $(classs);
    let pageItems = pageItemsRaw.map((index, item) => ({ page, item }));
    // @ts-ignore
    $perPage[page] = $;

    itemList.push(...pageItems);

    page++;
  }

  return {
    items: itemList,
    $perPage,
  };
}
