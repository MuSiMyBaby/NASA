import { getAllLaunches, scheduleNewLaunch, existLaunchWithId, abortLaunchById, } from "../../module/launches.model.js";
async function httpGetAllLaunches(req, res) {
    return res.status(200).json(await getAllLaunches());
}
async function httpAddNewLaunches(req, res) {
    const launch = req.body;
    if (!launch.mission ||
        !launch.rocket ||
        !launch.launchDate ||
        !launch.target) {
        return res.status(400).json({
            error: "We lost some launch property!",
        });
    }
    launch.launchDate = new Date(launch.launchDate);
    if (launch.launchDate.toString() === "Invalid Date" ||
        isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: "Invalid Date",
        });
    }
    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}
async function httpAbortLaunches(req, res) {
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
