import express from 'express';
import { httpGetAllLaunches, httpAddNewLaunches, httpAbortLaunches } from './launches.controller.js';
const launchesRouter = express.Router();
launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', httpAddNewLaunches);
launchesRouter.delete('/:id', httpAbortLaunches);
export { launchesRouter };
