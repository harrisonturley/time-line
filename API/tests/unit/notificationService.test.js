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

test("an invalid ID fails with an error", async done => {
    await pushNotification.getRestaurantsById("invalid string").catch(e => expect(e.statusCode).toBe(400));

    done();
});

test("send push notif w invalid string", async done => {
    await pushNotification.sendPushNotification("invalid string").catch(e => expect(e.statusCode).toBe(400));

    done();
});

test("send push notif w valid string", async done => {
    await pushNotification.sendPushNotification("WavvLdfdP6g8aZTtbBQHTw")
        .catch(e => expect(e.errorInfo.code).toBe('messaging/invalid-argument'));

    done();
});
