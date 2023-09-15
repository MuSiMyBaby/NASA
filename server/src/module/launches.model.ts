import launchesDB from "./launches.mongo.js";
import planets from "./planets.mongo.js";

const launches = new Map();
const DEFAULT_FLIGHT_NUMBER = 100;

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

//let latestFlightNumber: any = 100; // start new launches

const launch: flightList = {
  customers: ["Muc Ltd."], // server side decides
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27 , 2030"),
  target: "Kepler-1410 b",
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
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error("No matching planet found!");
  }

  try {
    await launchesDB.findOneAndUpdate(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      { upsert: true },
    );
  } catch (err) {
    console.error(err);
  }
}
async function getLatestFlightNumber() {
  const latestLaunch = await launchesDB.findOne().sort("-flightNumber"); // minus is descending
  if (!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER;
  }
  return latestLaunch?.flightNumber;
}

async function scheduleNewLaunch(launch: flightList) {
  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customer: ["Muc Ltd."],
    flightNumber: newFlightNumber,
  });
  await saveLaunch(newLaunch);
}
/* function addNewLaunches(launch: any) {
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
} */

async function existLaunchWithId(launchId: any) {
  return await launchesDB.findOne({
    flightNumber: launchId,
  });
}

/* function existLaunchWithId(launchId: any) {
  return launches.has(launchId);
}
 */
async function abortLaunchById(launchId: any) {
  const aborted = await launchesDB.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    },
  );
  return aborted.modifiedCount === 1;
  /*   const aborted = launchesDB.findOne(launchId);
  aborted.upcoming = false;
  aborted.success = false;
  return aborted; */
}

export {
  getAllLaunches,
  /*addNewLaunches*/
  scheduleNewLaunch,
  existLaunchWithId,
  abortLaunchById,
};
