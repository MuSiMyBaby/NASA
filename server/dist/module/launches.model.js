import launchesDB from "./launches.mongo.js";
import planets from "./planets.mongo.js";
const launches = new Map();
let latestFlightNumber = 100; // start new launches
const launch = {
    customers: ["Muc Ltd."],
    flightNumber: 100,
    mission: "Kepler Exploration X",
    rocket: "Explorer IS1",
    launchDate: new Date("December 27 , 2030"),
    target: "Kepler-1652 b",
    upcoming: true,
    success: true, // server side decides
};
saveLaunch(launch);
launches.set(launch.flightNumber, launch);
/* function getAllLaunches() {
  return Array.from(launches.values());
}
 */
async function getAllLaunches() {
    return await launchesDB.find({}, {
        _id: 0,
        __v: 0,
    });
}
async function saveLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target,
    });
    if (!planet) {
        throw new Error("No matching planet found!");
    }
    try {
        await launchesDB.updateOne({
            flightNumber: launch.flightNumber,
        }, launch, { upsert: true });
    }
    catch (err) {
        console.error(err);
    }
}
function addNewLaunches(launch) {
    latestFlightNumber++;
    launches.set(latestFlightNumber, Object.assign(launch, {
        upcoming: true,
        customer: ["Muc Ltd."],
        flightNumber: latestFlightNumber,
        success: true,
    }));
}
function existLaunchWithId(launchId) {
    return launches.has(launchId);
}
function abortLaunchById(launchId) {
    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}
export { getAllLaunches, addNewLaunches, existLaunchWithId, abortLaunchById };
