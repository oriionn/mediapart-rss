import { Feed } from "feed";
import { FeedType } from "./models/feed";
import { feedConfigs } from "./constants";
import Elysia from "elysia";

import NewsRoute from "./routes/news";
import InvestigationRoute from "./routes/investigation";

new Elysia()
  .get("/", { status: 200, message: "RSS feed is operational." })
  .use(NewsRoute)
  .use(InvestigationRoute)
  .on("start", () => {
    console.log("Server started on http://localhost:3000");
  })
  .listen(3000);
