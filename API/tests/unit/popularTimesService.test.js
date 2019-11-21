const popService= require("../../service/popularTimesService");

//these may change in the future so look here first if tests start failing
const timsData = 
[{'name': 'Monday', 'data': [0, 0, 0, 0, 0, 0, 5, 19, 44, 58, 53, 61, 87, 87, 72, 72, 69, 47, 22, 7, 0, 0, 0, 0]}, 
{'name': 'Tuesday', 'data': [0, 0, 0, 0, 0, 0, 3, 18, 53, 79, 70, 62, 76, 82, 75, 72, 74, 64, 42, 21, 0, 0, 0, 0]}, 
{'name': 'Wednesday', 'data': [0, 0, 0, 0, 0, 0, 11, 32, 58, 69, 67, 73, 87, 81, 61, 55, 64, 65, 48, 25, 0, 0, 0, 0]}, 
{'name': 'Thursday', 'data': [0, 0, 0, 0, 0, 0, 9, 31, 62, 77, 71, 75, 99, 97, 68, 65, 81, 67, 32, 8, 0, 0, 0, 0]}, 
{'name': 'Friday', 'data': [0, 0, 0, 0, 0, 0, 6, 31, 75, 97, 82, 71, 83, 98, 100, 85, 61, 36, 18, 7, 0, 0, 0, 0]}, 
{'name': 'Saturday', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}, 
{'name': 'Sunday', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}]

const garyData = 
[{'name': 'Monday', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 37, 61, 79, 79, 61, 0, 0]}, 
{'name': 'Tuesday', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 37, 64, 84, 87, 69, 0, 0]}, 
{'name': 'Wednesday', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 19, 45, 77, 93, 80, 0, 0]}, 
{'name': 'Thursday', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 30, 56, 73, 79, 81, 0, 0]}, 
{'name': 'Friday', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 41, 60, 72, 69, 0, 0]}, 
{'name': 'Saturday', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 50, 79, 98, 100, 80, 0, 0]}, 
{'name': 'Sunday', 'data': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 38, 72, 99, 100, 87, 0, 0]}]

//in JS, Sunday is 0 and Monday is 1, but in python Monday is 0, so need to sub 1 and mod 7
var date = new Date()
var day = (date.getDay() -1)%7
var hour = date.getHours()

var presentGaryData = garyData[day]["data"][hour];
var presentTimsData = timsData[day]["data"][hour];

test("test it gets correct phone number 1", () => {
    return popService.getGoogleIdInfo(
        "B3DOnmh1XLN_rW3Y105hvA").then(e => expect(e.phone).toEqual("+16042215011"))
        .catch();
});

test("test it gets correct phone number 2", () => {
    return popService.getGoogleIdInfo(
        "9IiOJ-XvaxRTbjbj640ssw").then(e => expect(e.phone).toEqual("+16047377714"))
        .catch();
});

test("an invalid ID fails with an error", () => {
    return popService.getGoogleIdInfo(
        "invalid string").catch(e => expect(e.statusCode).toEqual(400));
});

test("test it gets correct google id 1", () => {
    return popService.getGoogleId(
        "+16042215011").then(e => expect(e).toEqual("ChIJQQSo-ORyhlQR7_79L8Bx5DU"))
        .catch();
});

test("test it gets correct google id 2", () => {
    return popService.getGoogleId(
        "+16047377714").then(e => expect(e).toEqual("ChIJPbaHdrhzhlQReM4dHz3EV0U"))
        .catch();
});

test("an invalid input fails with an error", () => {
    return popService.getGoogleId(
        "invalid string").catch(e => expect(e.statusCode).toEqual(400));
});

test("returns correct data given gary danko google id", () => {
    return popService.getPopularTimes(
        "WavvLdfdP6g8aZTtbBQHTw").then(e => expect(e).toMatch("wait time is: " + presentGaryData))
        .catch();
});

test("returns correct data given tims hortons google id", () => {
    return popService.getPopularTimes(
        "FX7Dw41atuJ4oeTK6WtDUQ").then(e => expect(e).toMatch("wait time is: " + presentTimsData))
        .catch();
});

test("returns no data available when given a restaurant with no populartimes", () => {
    return popService.getPopularTimes(
        "M1kP4u3OmtUEW_9ob8ZH7A").then(e => expect(e).toMatch("no data exists"))
        .catch();
});

test("returns no success when given bad input", () => {
    return popService.getPopularTimes(
        "bad input").catch(e => expect(e.statusCode).toBe(400));
});

