import request from "supertest";
import app from "../../app";
import { mongoConnect, mongoDisconnect } from "../../Utilities/mongo";
import launchesDB from "../../module/launches.mongo.js";
import dotenv from "dotenv";
/* dotenv.config();
const MONGO_URL = process.env.MONGO_URL; */
//xWnK0EhcyZekcQeJ
/* describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });
  afterAll(async () => {
    await mongoDisconnect();
  });
  describe("Test/GET /v1/launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });
  describe("Test POST/launch", () => {
    const launchDateWithDate = {
      mission: "Help Daddy",
      rocket: "TA-CHUANG",
      target: "Kepler-1652 b",
      launchDate: "2028/01/04",
    };
    const launchDateWithInvalidDate = {
      mission: "Help Daddy",
      rocket: "TA-CHUANG",
      target: "POO POO",
      launchDate: "ImNotADate",
    };
    const launchDateWithoutDate = {
      mission: "Help Daddy",
      rocket: "TA-CHUANG",
      target: "Kepler-1652 b",
    };

    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDateWithDate)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(launchDateWithDate.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);
      expect(response.body).toMatchObject(launchDateWithoutDate);
    });
    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDateWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "We lost some launch property!",
      });
    });
    test("It should catch invalid dates", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDateWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "Invalid Date",
      });
    });
  });
});
 */
