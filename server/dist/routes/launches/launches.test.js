import request from "supertest";
import app from "../../app";
describe("Test/GET /launches", () => {
    test("It should respond with 200 success", async () => {
        const response = await request(app)
            .get("/launches")
            .expect("Content-Type", /json/)
            .expect(200);
    });
});
describe("Test POST/launch", () => {
    test("It should respond with 200 success", async () => {
        const launchDateWithDate = {
            mission: "Help Daddy",
            rocket: "TA-CHUANG",
            target: "Kepler-186 f",
            launchDate: "2028/01/04",
        };
        const launchDateWithoutDate = {
            mission: "Help Daddy",
            rocket: "TA-CHUANG",
            target: "Kepler-186 f",
        };
        const response = await request(app)
            .post("/launches")
            .send(launchDateWithDate)
            .expect("Content-Type", /json/)
            .expect(201);
        const requestDate = new Date(launchDateWithDate.launchDate).valueOf();
        const responseDate = new Date(response.body.launchDate).valueOf();
        expect(responseDate).toBe(requestDate);
        expect(response.body).toMatchObject(launchDateWithoutDate);
    });
    test("It should catch missing required properties", async () => {
        const response = await request(app);
    });
});
test("It should catch missing required properties", () => { });
test("It should catch invalid dates", () => { });
