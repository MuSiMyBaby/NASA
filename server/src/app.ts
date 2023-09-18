import express from "express";
import { planetsRouter } from "./routes/planets/planets.router.js";
import { launchesRouter } from "./routes/launches/launches.router.js";
import cors from "cors";
import url from "url";
import path from "path";
import morgan from "morgan";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const index_url = path.join(__dirname, "..", "public", "index.html");

const app = express(); // just a middleware (req,res,next);

const whiteList = new RegExp(/^http:\/\/localhost:\d+$/);

const corsOptions = {
  origin: whiteList,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(morgan("common"));

app.use(express.json()); // check ContentType;
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/planets", planetsRouter); // go through router;
app.use("/launches", launchesRouter); // go through router;

app.get("/*", (req, res) => {
  //* regexp
  res.sendFile(index_url);
});
export default app;
