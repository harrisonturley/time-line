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

const lineupErrorSendMessage = {
	"id": "dFX7Dw41atuJ4oeTK6WtDUQ",
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
    expect(pushNotification.getRestaurantsById(
        "invalid string")).rejects.toContain("error");
});

test("don't send push notif w valid string", () => {
    expect(pushNotification.checkToSendPushNotification(
        lineupNoTriggerNotification, "WavvLdfdP6g8aZTtbBQHTw")).resolves.toBe("no need for notification");
});

test("send push notif w invalid string", () => {
    return pushNotification.checkToSendPushNotification(
        lineupTriggerNotification, "invalid string").catch(e => expect(e).toMatch("not a valid restaurant id"));
}); 

test("send push notif w valid string", () => {
    expect(pushNotification.checkToSendPushNotification(
        lineupTriggerNotification, "WavvLdfdP6g8aZTtbBQHTw")).resolves.toBe("sent message");
}); 

test("send push notif w valid string", () => {
    expect(pushNotification.checkToSendPushNotification(
        lineupErrorSendMessage, "FX7Dw41atuJ4oeTK6WtDUQ")).rejects.toBe("error sending message");
}); 
