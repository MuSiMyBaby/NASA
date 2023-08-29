import { app } from "../../app";
import supertest from "supertest";

describe("Test GET /launches", () => {
  test("it should respond with 200 success", async () => {
    const response = await supertest(app).get("/launches").expect(200);
  });
});

describe("Test POST /launches", () => {
  const launchesWithDate = {
    mission: "Muc Enterprise",
    rocket: "MVP-10090",
    target: "Kepler-111",
    launchDate: "1-1-0000",
  };
  const launchesWithoutDate = {
    mission: "Muc Enterprise",
    rocket: "MVP-10090",
    target: "Kepler-111",
  };

  const launchesDateWithInvalided = {
    mission: "Muc Enterprise",
    rocket: "MVP-10090",
    target: "Kepler-111",
    launchDate: "AHA MOMENT",
  };

  test("it should respond with 201 created", async () => {
    const response = await supertest(app)
      .post("/launches")
      .send(launchesWithDate)
      .expect("Content-Type", /json/)
      .expect(201);
    const requestDate = new Date(launchesWithDate.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();
    expect(responseDate).toBe(requestDate);
    expect(response.body).toMatchObject(launchesWithoutDate);
  });

  test("It should catch missing required properties", async () => {
    const response = await supertest(app)
      .post("/launches")
      .send(launchesWithoutDate)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "We lost some launch property!",
    });
  });

  test("It should catch invalid date", async () => {
    const response = await supertest(app)
      .post("/launches")
      .send(launchesDateWithInvalided)
      .expect("Content-Type", /json/)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "Invalid Date",
    });
  });
});
