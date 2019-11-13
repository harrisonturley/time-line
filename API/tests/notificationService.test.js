const pushNotification = require("../service/notificationService");

const lineupTriggerNotification = {
	"id": "WavvLdfdP6g8aZTtbBQHTw",
    "lineupTime": 4
}

const lineupNoTriggerNotification = {
	"id": "WavvLdfdP6g8aZTtbBQHTw",
    "lineupTime": 6
}



test("put something useful here", () => {
    expect(pushNotification.getRestaurantsById(
        "WavvLdfdP6g8aZTtbBQHTw")).resolves.toBe("Gary Danko");
});

test("put something useful here", () => {
    expect(pushNotification.getRestaurantsById(
        "FX7Dw41atuJ4oeTK6WtDUQ")).resolves.toBe("Tim Hortons");
});

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
    expect.assertions(2);  
    return pushNotification.checkToSendPushNotification(
        lineupTriggerNotification, "invalid string").catch(e => expect(e).toMatch("not a valid restaurant id"));
        //lineupTriggerNotification, "invalid string")).rejects.toBe("not a valid restaurant id");
});

//why does this test have warnings.... think about it
//mock it??
test("send push notif w valid string", () => {
    //hardcode/make the mock function? how does it know?
    expect(pushNotification.checkToSendPushNotification(
        lineupTriggerNotification, "WavvLdfdP6g8aZTtbBQHTw")).resolves.toBe("sent message");
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