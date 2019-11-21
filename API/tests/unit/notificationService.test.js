const pushNotification = require("../../service/notificationService");

const mockNotificationController = jest.mock("../../controller/notificationController");


const lineupTriggerNotification = {
	"id": "WavvLdfdP6g8aZTtbBQHTw",
    "lineupTime": 4
}

const lineupNoTriggerNotification = {
	"id": "WavvLdfdP6g8aZTtbBQHTw",
    "lineupTime": 6
}

test("test it works with known id 1", () => {
    expect(pushNotification.getRestaurantsById(
        "WavvLdfdP6g8aZTtbBQHTw")).resolves.toBe("Gary Danko");
});

test("test it works with known id 2", () => {
    expect(pushNotification.getRestaurantsById(
        "FX7Dw41atuJ4oeTK6WtDUQ")).resolves.toBe("Tim Hortons");
});


test("an invalid ID fails with an error", () => {
    return pushNotification.getRestaurantsById(
        "invalid string").catch(e => expect(e.statusCode).toEqual(400));
});

test("don't send push notif", () => {
    expect(pushNotification.checkToSendPushNotification(
        lineupNoTriggerNotification, "WavvLdfdP6g8aZTtbBQHTw")).resolves.toBe("no need for notification");
});

test("send push notif w valid string", () => {
    jest.useFakeTimers()
    return pushNotification.checkToSendPushNotification(
        lineupTriggerNotification, "WavvLdfdP6g8aZTtbBQHTw")
        .then(res => expect(res).toBe("sent message"))
        .catch(e => expect(e).toMatch("error sending message"));
}); 

test("send push notif w invalid string", () => {
    jest.useFakeTimers()
    return pushNotification.checkToSendPushNotification(
        lineupTriggerNotification, "invalid string")
        .then(res => expect(res).toBe("sent message"))
        .catch(e => expect(e).toMatch("not a valid restaurant id"));
}); 
