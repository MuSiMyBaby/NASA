import launchesDB from "./launches.mongo.js";
import planets from "./planets.mongo.js";

const launches = new Map();

interface flightList {
  flightNumber: number;
  mission: string;
  rocket: string;
  launchDate: Date;
  target: string;
  customers: string[];
  upcoming: boolean;
  success: boolean;
}

let latestFlightNumber: any = 100; // start new launches

const launch: flightList = {
  customers: ["Muc Ltd."], // server side decides
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27 , 2030"),
  target: "Kepler-442 b",
  upcoming: true, // server side decides
  success: true, // server side decides
};

saveLaunch(launch);
launches.set(launch.flightNumber, launch);

/* function getAllLaunches() {
  return Array.from(launches.values());
}
 */

async function getAllLaunches() {
  return await launchesDB.find(
    {},
    {
      _id: 0,
      __v: 0,
    },
  );
}
async function saveLaunch(launch: flightList) {
  try {
    console.log(
      await planets.findOne({
        keplerName: launch.target,
      }),
    );

    await launchesDB.updateOne(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      { upsert: true },
    );
    console.log(launchesDB.length);
  } catch (err) {
    console.error(err);
  }
}

function addNewLaunches(launch: any) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      upcoming: true,
      customer: ["Muc Ltd."],
      flightNumber: latestFlightNumber,
      success: true,
    }),
  );
}

function existLaunchWithId(launchId: any) {
  console.log(launches);
  return launches.has(launchId);
}

function abortLaunchById(launchId: any) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted;
}

export { getAllLaunches, addNewLaunches, existLaunchWithId, abortLaunchById };
