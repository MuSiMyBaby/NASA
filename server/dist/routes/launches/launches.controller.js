import { getAllLaunches, addNewLaunches, existLaunchWithId, abortLaunchById, } from "../../module/launches.model.js";
async function httpGetAllLaunches(req, res) {
    return res.status(200).json(await getAllLaunches());
}
function httpAddNewLaunches(req, res) {
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
    addNewLaunches(launch);
    return res.status(201).json(launch);
}
function httpAbortLaunches(req, res) {
    const launchId = Number(req.params.id); // Number(req.params.id);
    if (!existLaunchWithId(launchId)) {
        return res.status(404).json({
            err: "Launch not found",
        });
    }
    const aborted = abortLaunchById(launchId);
    return res.status(200).json(aborted);
}
export { httpGetAllLaunches, httpAddNewLaunches, httpAbortLaunches };
