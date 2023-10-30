import express from "express";
const api = express.Router();
import { planetsRouter } from "./planets/planets.router.js";
import { launchesRouter } from "./launches/launches.router.js";
api.use("/planets", planetsRouter); // go through router;
api.use("/launches", launchesRouter); // go through router;
export default api;
