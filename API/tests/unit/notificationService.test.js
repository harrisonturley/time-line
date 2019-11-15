const pushNotification = require("../../service/notificationService");

const mockNotificationController = jest.mock("../../controller/notificationController");


//when have these together calls mock
//import notifController, {notificationMock} from "../controller/notificationController";
//jest.mock("../controller/notificationController");


const lineupTriggerNotification = {
	"id": "WavvLdfdP6g8aZTtbBQHTw",
    "lineupTime": 4
}

const lineupNoTriggerNotification = {
	"id": "WavvLdfdP6g8aZTtbBQHTw",
    "lineupTime": 6
}

//trigger notif controller mock error w tims
const lineupErrorSendMessage = {
	"id": "dFX7Dw41atuJ4oeTK6WtDUQ",
    "lineupTime": 6
}

//cant mock request cuz external module?


//do not mock request
test("put something useful here", () => {
    expect(pushNotification.getRestaurantsById(
        "WavvLdfdP6g8aZTtbBQHTw")).resolves.toBe("Gary Danko");
});

//do not mock request, want to see that it works here 
test("put something useful here", () => {
    expect(pushNotification.getRestaurantsById(
        "FX7Dw41atuJ4oeTK6WtDUQ")).resolves.toBe("Tim Hortons");
});

//check that returns error -> mock or not?
test("an invalid ID fails with an error", () => {
    expect(pushNotification.getRestaurantsById(
        "invalid string")).rejects.toContain("error");
});

test("don't send push notif w valid string", () => {
    expect(pushNotification.checkToSendPushNotification(
        lineupNoTriggerNotification, "WavvLdfdP6g8aZTtbBQHTw")).resolves.toBe("no need for notification");
});


//need it unmocked cuz want valid restaurant id
test("send push notif w invalid string", () => {
    //expect.assertions(2); //why does this go between 1 and 2 
    return pushNotification.checkToSendPushNotification(
        lineupTriggerNotification, "invalid string").catch(e => expect(e).toMatch("not a valid restaurant id"));
}); 





//why does this test have warnings.... think about it
//dont mock it cuz same module as one under test.
//uses mock

test("send push notif w valid string", () => {

    expect(pushNotification.checkToSendPushNotification(
        lineupTriggerNotification, "WavvLdfdP6g8aZTtbBQHTw")).resolves.toBe("sent message");
    //expect(mockNotificationController).toHaveBeenCalledTimes(1);
}); 


//uses mock
test("send push notif w valid string", () => {

    //mockNotificationController.mockClear();
    //expect(mockNotificationController).not.toHaveBeenCalled();
    expect(pushNotification.checkToSendPushNotification(
        lineupErrorSendMessage, "FX7Dw41atuJ4oeTK6WtDUQ")).rejects.toBe("error sending message");
    //expect(mockNotificationController).toHaveBeenCalledTimes(1);
}); 




//make mock of get restaurant by id
// and then see if it was called or something?

//then also test it w/o mock for part of integration test?
//can do unmock

//in jest can mock/unmock
//spy on
//to be falsy to be truth
//to have been called??

//test lineup controller router.put update lineup
//test verify login user exists?

//later see if need to help mark more


//integreation: call check to send, expect get by id to have been called
//unit test get restuarnat by id should be easy
//reason how to test check push notif