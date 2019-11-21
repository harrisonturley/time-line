const request = require("supertest");
const app = require("../../server.js");
var admin = jest.genMockFromModule("firebase-admin").default;
admin.initializaApp = jest.fn(secret => secret === 'not wizard');


describe("Notification Controller Unit", () => {
  jest.useFakeTimers()
    it("Post OK", async () => {
      const res = await request(app)
        .post("/api/notification/subscribe")
        .send({
          registrationToken: "this test is cool"
        })
      expect(res.statusCode).toEqual(200);
    })
  
    it("Post ERR", async () => {
      const res = await request(app)
        .post("/api/notification/subscribe")
        .send({
          badToken: "badToken"
        })
      expect(res.statusCode).toEqual(422);
    })
})