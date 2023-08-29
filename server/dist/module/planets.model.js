import { stat, createReadStream } from "fs";
import path from "path";
import { promisify } from "util";
import { parse } from "csv-parse";
import url from "url";
import planets from "./planets.mongo.js";
const fileStat = promisify(stat);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const kepler_url = path.join(__dirname, "..", "..", "data", "kepler_data.csv");
const kepler_name = createReadStream(kepler_url, {
    highWaterMark: 48000, // no meaning
});
function isHabitablePlanets(planet) {
    return (planet["koi_disposition"] === "CONFIRMED" &&
        planet["koi_insol"] > 0.36 &&
        planet["koi_insol"] < 1.11 &&
        planet["koi_prad"] < 1.6);
}
async function loadPlanetsDate() {
    try {
        await planets.deleteMany({});
        const statResult = await fileStat(kepler_url);
        console.log(`The size of file is ${statResult.size}`);
        const parser = kepler_name.pipe(parse({ comment: "#", columns: true }));
        for await (const chunk of parser) {
            if (await isHabitablePlanets(chunk)) {
                // await console.log(chunk.kepler_name);
                await savePlanet(chunk); // Note the await here
            }
        }
        const countPlanetsFound = (await getHabitablePlanets()).length;
        console.log(`now we have ${countPlanetsFound} habitable plants!\n`);
    }
    catch (error) {
        console.error(`An error occurred: ${error}`);
        throw error;
    }
}
/*
async function loadPlanetsDate() {
  try {
    const stat = await fileStat(kepler_url);
    console.log(stat.size + " byte");

    const parser = kepler_name.pipe(parse({ comment: "#", columns: true }));

    for await (const chunk of parser) {
      if (isHabitablePlanets(chunk)) {
        savePlanet(chunk);
      }
    }

    process.stdout.write(
      const countPlanetsFound = await getAllPlanets
      `now we have ${habitablePlanets.length} habitable planets!\n`,
    );
  } catch (error) {
    console.error(`An error occurred: ${error}`);
    throw error; // Rethrow the error to be caught by the caller
  }
} */
async function savePlanet(planet) {
    try {
        await planets.updateOne({ keplerName: planet.kepler_name }, { $set: { keplerName: planet.kepler_name } }, { upsert: true });
        //console.log(`Saved planet: ${planet.kepler_name}`);
    }
    catch (err) {
        console.error(`Could not save planet ${err}`);
    }
}
async function getHabitablePlanets() {
    const foundPlanets = await planets.find({});
    //console.log(foundPlanets); // make should it's right.
    return foundPlanets;
}
export { loadPlanetsDate, getHabitablePlanets };
