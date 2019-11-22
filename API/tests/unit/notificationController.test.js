const request = require("supertest");
const app = require("../../server.js");
import notificationService, {notificationServiceMock} from "../../service/notificationService";
jest.mock("../../service/notificationService");
var admin = jest.genMockFromModule("firebase-admin").default;
admin.initializaApp = jest.fn((secret) => secret === "mock");


describe("Notification Controller Unit", () => {
    it("Subscribe OK", async () => {
      const res = await request(app)
        .post("/api/notification/subscribe")
        .send({
          registrationToken: "sample",
          restaurantId: "someid"
        });
      expect(res.statusCode).toEqual(200);
    });
  
    it("Subscribe ERR", async () => {
      const res = await request(app)
        .post("/api/notification/subscribe")
        .send({
          badToken: "badToken"
        });
      expect(res.statusCode).toEqual(422);
    });

    it("Unsubscribe OK", async () => {
      const res = await request(app)
        .post("/api/notification/unsubscribe")
        .send({
          registrationToken: "sample",
          restaurantId: "someid"
        });
      expect(res.statusCode).toEqual(200);
    });
  
    it("Unsubscribe ERR", async () => {
      const res = await request(app)
        .post("/api/notification/unsubscribe")
        .send({
          badToken: "badToken"
        });
      expect(res.statusCode).toEqual(422);
    });
});