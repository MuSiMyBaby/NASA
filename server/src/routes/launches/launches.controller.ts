import {
  getAllLaunches,
  scheduleNewLaunch,
  existLaunchWithId,
  abortLaunchById,
} from "../../module/launches.model.js";
import getPagination from "../../Utilities/query.js";

async function httpGetAllLaunches(req: any, res: any) {
  const { skip, limit } = getPagination(req.query);
  const launches = await getAllLaunches(skip, limit);
  return res.status(200).json(launches);
}

async function httpAddNewLaunches(req: any, res: any) {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "We lost some launch property!",
    });
  }
  launch.launchDate = new Date(launch.launchDate);

  if (
    launch.launchDate.toString() === "Invalid Date" ||
    isNaN(launch.launchDate)
  ) {
    return res.status(400).json({
      error: "Invalid Date",
    });
  }
  try {
    await scheduleNewLaunch(launch);
  } catch {
    console.log("failed");
  }
  return res.status(201).json(launch);
}

async function httpAbortLaunches(req: any, res: any) {
  const launchId = Number(req.params.id); // Number(req.params.id);
  const existLaunch = await existLaunchWithId(launchId);
  if (!existLaunch) {
    return res.status(404).json({
      err: "Launch not found",
    });
  }
  const aborted = abortLaunchById(launchId);
  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }
  return res.status(200).json({
    ok: true,
  });
}

export { httpGetAllLaunches, httpAddNewLaunches, httpAbortLaunches };
