import { getHabitablePlanets } from "../../module/planets.model.js";

async function getAllPlanets(req: any, res: any): Promise<any> {
  return res.status(200).json(await getHabitablePlanets()); //return allow function execute only once.
}

export { getAllPlanets };
