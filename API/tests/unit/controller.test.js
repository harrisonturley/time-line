const request = require("supertest");
const app = require("../../server.js");

const queryString = "/api/search/restaurants?keyword=Tim%20Hortons&latitude=49.258335&longitude=-123.249585";

var lineupId1 = uuidv4();
var lineupId2 = uuidv4();
var userEmail1 = uuidv4() + "@gmail.com";
var userEmail2 = uuidv4() + "@gmail.com";

import lineupService, {lineupServiceMock} from "../../service/lineupService";
jest.mock("../../service/lineupService");

import userService, {userServiceMock} from "../../service/user/userService";
jest.mock("../../service/userService");

import searchService, {searchServiceMock} from "../../service/searchService";
jest.mock("../../service/searchService");

beforeAll(done => {
    done();
});
  
afterAll(done => {
    done();
});

describe("Lineup Controller", () => {

  it("Get OK", async () => {
    const res = await request(app)
      .get("/api/lineups/FX7Dw41atuJ4oeTK6WtDUQ");
    expect(res.statusCode).toEqual(200);
    expect(res.body.lineupTime).toBe(8);
  })

  it("Get ERR", async () => {
    const res = await request(app)
      .get("/api/lineups/badid");
    expect(res.body).toMatchObject({});
  })

  it("Post OK", async () => {
    const res = await request(app)
      .post("/api/lineups")
      .send({
        id: lineupId1,
        lineupTime: 7
   });
    expect(res.statusCode).toEqual(200);
  })

  it("Post ERR", async () => {
    const res = await request(app)
      .post("/api/lineups")
      .send({
        bad_id: "bad id",
        lineupTime: 8
      })
    expect(res.statusCode).toEqual(422);
  })

  it("Put OK", async () => {
    const res = await request(app)
      .put("/api/lineups/FX7Dw41atuJ4oeTK6WtDUQ")
      .send({
        id: "FX7Dw41atuJ4oeTK6WtDUQ",
        lineupTime: 8
   });
    expect(res.statusCode).toEqual(200);
  })

  it("Put ERR", async () => {
    const res = await request(app)
      .put("/api/lineups/FX7Dw41atuJ4oeTK6WtDUQ")
      .send({
        bad_id: "FX7Dw41atuJ4oeTK6WtDUQ"
      })
    expect(res.lineupTime).toBeUndefined();
  })

  it("Delete OK", async () => {
    const res = await request(app)
      .delete("/api/lineups/" + lineupId1);
    expect(res.statusCode).toEqual(200);
  })

  it("Delete ERR", async () => {
    const res = await request(app)
      .delete("/api/lineups/" + "err_" + lineupId2);
      expect(res.body).toMatchObject({});
  })

})

describe("Search Controller", () => {
  it("Get OK", async () => {
    const res = await request(app)
      .get(queryString)
    expect(res.statusCode).toEqual(200);
  })

  it("Get ERR", async () => {
    const res = await request(app)
      .get("/api/search/restaurants")
    expect(res.statusCode).toEqual(422);
  })
})

describe("Notification Controller", () => {
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

describe("User Controller", () => {

  it("Get OK", async () => {
    const res = await request(app)
      .get("/api/users/hello@gmail.com");
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe("victoria");
  })

  it("Get ERR", async () => {
    const res = await request(app)
    .get("/api/users/bademail");
    expect(res.body).toMatchObject({});
  })

  it("Post OK", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({
        email: userEmail1,
        name: "vic"
   });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe("vic");
    expect(res.body.balance).toBe(0);
  })

  it("Post ERR", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({
        bad_id: "bad id",
        name: "bad name"
      })
    expect(res.statusCode).toEqual(422);
  })

  it("Put OK", async () => {
    const res = await request(app)
      .put("/api/users/hello1@gmail.com")
      .send({
        email: "hello@gmail.com",
        name: "victoria",
        balance: 1
   });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toBe("victoria");
    expect(res.body.balance).toBe(1);
  })

  it("Put ERR", async () => {
    var bad_id;
    const res = await request(app)
      .put("/api/users/bad_id")
      .send({
        bad_id: "something random"
      })
    expect(res.body.name).toBeUndefined();
  })
  
  it("Delete OK", async () => {
    const res = await request(app)
      .delete("/api/users/" + userEmail1);
    expect(res.statusCode).toEqual(200);
  })

  it("Delete ERR", async () => {
    const res = await request(app)
      .delete("/api/users/" + "err_" + userEmail2);
      expect(res.body).toMatchObject({});
  })
})

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}




