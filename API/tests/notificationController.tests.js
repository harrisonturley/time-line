const request = require("supertest");

const app = require("../server.js");

describe("Post Endpoints", () => {
  it("should create a new post", async () => {
    const res = await request(app)
      .post("/api/notification/subscribe")
      .send({
        registrationToken: "this test is cool"
      })
    expect(res.statusCode).toEqual(200);
  })

  it("it should fail", async () => {
    const res = await request(app)
      .post("/api/notification/subscribe")
      .send({
        badToken: "badToken"
      })
    expect(res.statusCode).toEqual(422);
  })
})

module.exports = app;
