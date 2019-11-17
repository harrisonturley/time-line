//this is just for the beforeAll
const User = require("../../repository/user");
//module we are testing
const userService = require("../../service/userService");
//this is just for the beforeAll
const Lineup = require("../../repository/lineup");
//module we are testing
const lineupService = require("../../service/lineupService");
//module we are testing
const searchService = require("../../service/searchService");

//const app = require("./controller.test.js");
// const mongoose = app.mongoose;
// const listener = app.listener;
const app = require("../../server.js");
const mongoose = app.mongoose;
const listener = app.listener;
var userId1 = uuidv4();
var lineupId1 = uuidv4();

var query = {},
    updateUser = {
        email: "servicetest@gmail.com",
        name: "jenny",
        balance: 0
    },
    updateLineup = {
        id: "test id",
        lineupTime: 5
    },
    options = { upsert: true, new: true, setDefaultsOnInsert: true };

//TODO handle eaddr error: seperate listener? or put all tests in one file

//could have testing db but for now just adds and deletes items it adds
beforeAll(done => {
    User.findOneAndUpdate(query, updateUser, options).then(() => {
        Lineup.findOneAndUpdate(query, updateLineup, options)
        }).then(() => {
            //done();
        });
    //});

    /*User.findOneAndUpdate({
        email: "servicetest@gmail.com",
        name: "jenny",
        balance: 0
    }).then(() => {
        Lineup.create({
            id: "test id",
            lineupTime: 5
        }).then(() => {
            //done();
        });
    });*/

    done();
});

//remove all that we added to database
afterAll(done => {
    // Allow Jest to exit successfully.
    
    User.findOneAndRemove({email: "servicetest@gmail.com"});
    User.findOneAndRemove({email: userId1});
    Lineup.findOneAndDelete({id: "test id"});
    Lineup.findOneAndDelete({id: lineupId1});
    mongoose.connection.close();
    //listener.close();
    
    done();
});


describe("User Service", () => {

    //HMMM why does this fail sometimes when we include controller.test?
    it("getUserByEmail OK", () => {
        //setTimeout(function(){
        return userService.getUserByEmail(
            "servicetest@gmail.com").then(data => {
            expect(data.name).toBe("jenny");
            expect(data.balance).toBe(0);
        });
        //}, 500);
    });
    
    it("getUserByEmail ERR", () => {
        return userService.getUserByEmail(
            "non existent").then(data => {
            expect(data).toBeNull();
        });
    });

    it("addUser OK", () => {
        return userService.addUser({
            email: userId1,
            name: "bob"
        }).then(data => {
            expect(data.name).toBe("bob");
            expect(data.balance).toBe(0);
        });
    });
    
    it("addUser ERR", () => {
        return userService.addUser({
            data: "non existent"
        }).catch(e => expect(e.message).toContain("failed"));
    });

    it("updateUser OK", () => {
        setTimeout(function(){
        return userService.updateUser(
            userId1, {
            email: userId1,
            balance: 9
        }).then(data => {
            expect(data).toBe(9);
        });
        }, 500);
    });
    
    it("updateUser ERR", () => {
        return userService.updateUser(
            userId1, {
            data: "non existent"
        }).catch(e => expect(e.message).toContain("failed"));
    });

    it("deleteUser OK", () => {
        return userService.deleteUser(
            userId1).then(data => {
            expect(data).toMatchObject({});
        });
    });
    
    it("deleteUser ERR", () => {
        return userService.deleteUser(
            "non existent").then(data => {
            expect(data).toBeNull();
        });
    });
    
});

describe("Lineup Service", () => {

    it("getLineupById OK", () => {
        return lineupService.getLineupById(
            "test id").then(data => {
            expect(data.lineupTime).toBe(5);
        });
    });
    
    it("getLineupById ERR", () => {
        return lineupService.getLineupById(
            "non existent").then(data => {
            expect(data).toBeNull();
        });
    });

    //TODO can add more later
    it("getLineupByIds OK", () => {
        return lineupService.getLineupsByIds(
            "test id").then(data => {
            expect(data[0].lineupTime).toBe(5);
        });
    });
    
    it("getLineupByIds ERR", () => {
        return lineupService.getLineupsByIds(
            "non existent").then(data => {
            expect(data).toMatchObject([]);
        });
    });
    
    it("addLineup OK", () => {
        return lineupService.addLineup({
            id: lineupId1,
            lineupTime: 0
        }).then(data => {
            expect(data.lineupTime).toBe(0);
        });
    });
    
    it("addLineup ERR", () => {
        return lineupService.addLineup({
            data: "non existent"
        }).catch(e => expect(e.message).toContain("failed"));
    });
    
    it("updateLineup OK", () => {
        setTimeout(function(){
        return lineupService.updateLineup(
            lineupId1, {
                id: lineupId1,
                lineupTime: 4
            }).then(data => {
            expect(data).toBe(6);
        });
        }, 500);
    });
    
    it("updateLineup ERR", () => {
        return lineupService.updateLineup(
            lineupId1, {
            data: "non existent"
        }).catch(e => expect(e.message).toContain("failed"));
    });
    
    it("deleteLineup OK", () => {
        return lineupService.deleteLineup(
            lineupId1).then(data => {
            expect(data).toMatchObject({});
        });
    });
    
    it("deleteLineup ERR", () => {
        return lineupService.deleteLineup(
            "non existent").then(data => {
            expect(data).toBeNull();
        });
    });
   
});

describe("Search Service", () => {
    
    test("getRestaurants OK", () => {
    
        jest.setTimeout(15000);
    
        return searchService.getRestaurantsByKeywordAndCoordinates(
             "Tim%20Hortons", {latitude: "49.258335", longitude: "-123.249585"})
             .then(data => expect(data.businesses.id).toBe("FX7Dw41atuJ4oeTK6WtDUQ"));
    
        // const data = searchService.getRestaurantsByKeywordAndCoordinates(
        //     "Tim%20Hortons", {latitude: "49.258335", longitude: "-123.249585"});
        // expect(data).toBe("jenny");
    
    
        // expect(searchService.getRestaurantsByKeywordAndCoordinates(
        //     "Tim%20Hortons", {latitude: "49.258335", longitude: "-123.249585"}))
        //     .resolves.toBe("Gary Danko");
      
    
        // return searchService.getRestaurantsByKeywordAndCoordinates(
        //     "Tim%20Hortons", 
        //     {latitude: "49.258335", longitude: "-123.249585"}).then(data => {
        //     expect(data).toBe("jenny");
        // });
    
        //if mess up input "lonitude" returns status code 400
    });
  
    test("getRestaurants ERR", async () => {
        expect(searchService.getRestaurantsByKeywordAndCoordinates(
            "Tim%20Hortons", {latitude: "49.258335", longitude: "-123.249585"}))
            .rejects.toContain("error");
    });
  })

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}