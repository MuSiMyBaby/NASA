import launchesDB from "./launches.mongo.js";
import planets from "./planets.mongo.js";
import axios from "axios";

const DEFAULT_FLIGHT_NUMBER = 100;

interface flightList {
  flightNumber: number;
  mission: string;
  rocket: string;
  launchDate: Date;
  target?: string;
  customers: string[];
  upcoming: boolean;
  success: boolean;
}

//let latestFlightNumber: any = 100; // start new launches

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  console.log("Downloading launch data...");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
  if (response.status !== 200) {
    console.log("Problem downloading launch data");
    throw new Error("Launch data download failed.");
  }
  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload: any) => {
      return payload["customers"];
    });
    const launch = {
      customers: customers, // payload.customer for each payload
      flightNumber: launchDoc["flight_number"], //flight_number
      mission: launchDoc["name"], //name
      rocket: launchDoc["rocket"]["name"], //rocket name
      launchDate: launchDoc["date_local"], // date_local
      upcoming: launchDoc["upcoming"], // upcoming
      success: launchDoc["success"], // success
    };
    console.log(launch.flightNumber, launch.mission);
    saveLaunch(launch);
  }
}

async function loadLaunchData() {
  try {
    const firstLaunch = await findLaunch({
      flightNumber: 1,
      rocket: "Falcon 1",
      mission: "FalconSat",
    });
    if (firstLaunch) {
      console.log("launch data already loaded");
    } else {
      await populateLaunches();
    }
  } catch (error) {
    console.error("Error loading launch data:", error);
  }
}

/* function getAllLaunches() {
  return Array.from(launches.values());
}
 */

async function getAllLaunches(skip: any, limit: any) {
  return await launchesDB
    .find(
      {},
      {
        _id: 0,
        __v: 0,
      },
    )
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function saveLaunch(launch: flightList) {
  try {
    console.log("Im saving");
    await launchesDB.findOneAndUpdate(
      {
        flightNumber: launch.flightNumber,
      },
      launch,
      { upsert: true },
    );
  } catch (err) {
    +console.error(err);
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
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error("No matching planet found!");
  }
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

async function findLaunch(filter: any) {
  return await launchesDB.findOne(filter);
}

async function existLaunchWithId(launchId: any) {
  return await findLaunch({
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
  loadLaunchData,
  /*addNewLaunches*/
  scheduleNewLaunch,
  existLaunchWithId,
  abortLaunchById,
};
