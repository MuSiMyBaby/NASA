import http from "http";
import app from "./app.js";
import { loadPlanetsDate } from "./module/planets.model.js";
import mongoose from "mongoose";

const PORT = process.env.PORT || 9999;
const MONGO_URL =
  "mongodb+srv://NASA-API:CiNxwcJnG8YeOupF@cluster0.1sfdpwq.mongodb.net/?retryWrites=true&w=majority";
const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL);
  await loadPlanetsDate();

  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}
startServer();
