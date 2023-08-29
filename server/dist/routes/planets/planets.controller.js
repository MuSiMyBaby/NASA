import { getHabitablePlanets } from "../../module/planets.model.js";
async function getAllPlanets(req, res) {
    return res.status(200).json(await getHabitablePlanets()); //return allow function execute only once.
}
export { getAllPlanets };
