//Modules we are testing
const userService = require("../../service/user/userService");
const lineupService = require("../../service/lineupService");

import notificationService, {notificationServiceMock} from "../../service/notificationService";
jest.mock("../../service/notificationService");

import Lineup, {lineupMock} from "../../repository/lineup";
jest.mock("../../repository/lineup");

import User, {userMock} from "../../repository/user";
jest.mock("../../repository/user");

const app = require("../../server.js");

var userId1 = uuidv4();
var lineupId1 = uuidv4();


beforeAll(done => {
    done();
});

afterAll(done => {
    done();
});


describe("User Service", () => {

    it("getUserByEmail OK", () => {
        return userService.getUserByEmail(
            "servicetest@gmail.com").then((data) => {
            expect(data.name).toBe("jenny");
            expect(data.balance).toBe(0);
        });
    });
    
    it("getUserByEmail ERR", () => {
        return userService.getUserByEmail(
            "non existent").then((data) => {
            expect(data).toBeUndefined();
        });
    });

    it("addUser OK", () => {
        return userService.addUser({
            email: userId1,
            name: "bob"
        }).then((data) => {
            expect(data.name).toBe("bob");
            expect(data.balance).toBe(0);
        });
    });
    
    it("addUser ERR", () => {
        return userService.addUser({
            data: "non existent"
        }).catch((e) => expect(e.message).toContain("failed"));
    });

    it("updateUser OK", () => {
        setTimeout(function(){
        return userService.updateUser(
            userId1, {
            email: userId1,
            balance: 9
        }).then((data) => {
            expect(data.balance).toBe(9);
        });
        }, 500);
    });
    
    it("updateUser ERR", () => {
        return userService.updateUser(
            userId1, {
            data: "non existent"
        }).catch((e) => expect(e.message).toContain("failed"));
    });

    it("deleteUser OK", () => {
        return userService.deleteUser(
            userId1).then((data) => {
            expect(data).toMatchObject({});
        });
    });
    
    it("deleteUser ERR", () => {
        return userService.deleteUser(
            "non existent").then((data) => {
            expect(data).toBeUndefined();
        });
    });
    
});

describe("Lineup Service", () => {

    it("getLineupById OK", () => {
        return lineupService.getLineupById(
            "test id").then((data) => {
            expect(data.lineupTime).toBe(5);
        });
    });
    
    it("getLineupById ERR", () => {
        return lineupService.getLineupById(
            "non existent").then((data) => {
            expect(data).toContain("error");
        });
    });

    it("getLineupByIds OK", () => {
        return lineupService.getLineupsByIds(
            "test id").then((data) => {
            expect(data.lineupTime).toBe(5);
        });
    });
    
    it("getLineupByIds ERR", () => {
        return lineupService.getLineupsByIds(
            "non existent").then((data) => {
            expect(data).toMatchObject([]);
        });
    });
    
    it("addLineup OK", () => {
        return lineupService.addLineup({
            id: lineupId1,
            lineupTime: 0
        }).then((data) => {
            expect(data.lineupTime).toBe(0);
        });
    });
    
    it("addLineup ERR", () => {
        return lineupService.addLineup({
            data: "non existent"
        }).catch((e) => expect(e.message).toContain("failed"));
    });
    
    it("updateLineup OK", () => {
        return lineupService.updateLineup(
            "Tim Hortons", {
                id: "Tim Hortons",
                lineupTime: 7
            }).then((data) => {
            expect(data.lineupTime).toBe(7);
        });
    });
    
    it("updateLineup ERR", () => {
        return lineupService.updateLineup(
            lineupId1, {
            data: "non existent"
        }).catch((e) => expect(e.message).toContain("failed"));
    });
    
    it("deleteLineup OK", () => {
        return lineupService.deleteLineup(
            lineupId1).then((data) => {
            expect(data).toMatchObject({});
        });
    });
    
    it("deleteLineup ERR", () => {
        return lineupService.deleteLineup(
            "non existent").then((data) => {
            expect(data).toBeUndefined();
        });
    });
   
});

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}