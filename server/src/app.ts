import express from "express";
import cors from "cors";
import url from "url";
import path from "path";
import morgan from "morgan";
import api from "./routes/api.js";
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
app.use("/v1", api);
/* app.use("/v2", v2Api);
 */
app.get("/*", (req, res) => {
  //* regexp
  res.sendFile(index_url);
});
export default app;
