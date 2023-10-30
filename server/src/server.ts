import http from "http";
import { mongoConnect } from "./Utilities/mongo.js";
import app from "./app.js";
import { loadPlanetsDate } from "./module/planets.model.js";
import { loadLaunchData } from "./module/launches.model.js";
import planets from "./module/planets.mongo.js";
import launchDB from "./module/launches.mongo.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 9999;

const server = http.createServer(app);

async function startServer() {
  await mongoConnect();
  await loadPlanetsDate();
  await loadLaunchData();
  await launchDB.deleteMany({});
  await planets.deleteMany({});
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}
startServer();
