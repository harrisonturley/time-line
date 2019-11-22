const Lineup = require("../repository/lineup");
const pushNotification = require("./notificationService");
const outliers = require("outliers");
const stats = require("stats-lite");
const popularTimesService = require("./popularTimesService");

function getLineupById(id) {
    return Lineup.findOne({id}, {_id: 0, __v: 0}).lean();
}

async function getLineupsAverageLineupTimesByIds(ids) {
    const lineups = await Lineup.find({id: {$in: ids}}, {_id: 0, id: 1, averageLineupTime: 1}).lean();
    return lineups;
}

async function addLineup(lineupId, lineupTime) {
    console.log(lineupTime);
    console.log(lineupId);
    const currTime = Date.now();
    console.log(await Lineup.find({}));
    const lineupExists = await Lineup.exists({id: lineupId});
    console.log(lineupExists);
    const lineupTimeObj = {waitTime: lineupTime, timestamp: currTime};
    let lineupTimes = [];
    let prevAverageLineupTime = null;
    if (lineupExists) {
        const lineup = await getLineupById(lineupId);
        console.log(lineup);
        prevAverageLineupTime = lineup.averageLineupTime;
        lineupTimes = lineup.lineupTimes;
    }
    let waitTimes = lineupTimes.map(lineupTime => lineupTime.waitTime);

    // filter out the lineup times submitted more than 30 minutes ago
    lineupTimes.filter((lineupTime) => (currTime - lineupTime.timestamp) < 1800);

    // if the lineupTime is an outlier don't add it
    if (!isOutlier(lineupTimeObj.waitTime, waitTimes)) {
        waitTimes.push(lineupTimeObj.waitTime);
        console.log(waitTimes);
        lineupTimes.push(lineupTimeObj);
        console.log(lineupTimes);
    }

    // only maintain a max of 20 lineupTimes
    if (lineupTimes.length > 20) {
        lineupTimes.splice(0, 1);
    }

    // decide on how to get the wait time
    let averageLineupTime = 0;
    if (isValid(waitTimes)) {
        console.log("getting our averaged wait time");
        console.log(waitTimes);
        averageLineupTime = stats.mean(waitTimes);
        console.log(averageLineupTime);
    }
    else {
        // TODO victoria
        console.log("getting popularTimes wait time");
        averageLineupTime = await popularTimesService.getPopularTimes(id);
        console.log(averageLineupTime);
    }

    // write to db
    await Lineup.updateOne(
        {id: lineupId},
        {id: lineupId, lineupTimes: lineupTimes, averageLineupTime: averageLineupTime},
        {upsert: true, returnNewDocument: true}
    );

    // decide if we should send a push notification
    if (prevAverageLineupTime == null || (prevAverageLineupTime >= 5 && averageLineupTime < 5)) {
        await pushNotification.sendPushNotification(lineupId);
    }

    return {id: lineupId, lineupTime: averageLineupTime};
}

function isOutlier(waitTime, waitTimes) {
    if (waitTimes.length < 3) {
        return false;
    }
    let copy = waitTimes.slice(0);
    copy.push(waitTime);
    console.log('copy is' + copy);
    copy = copy.filter(outliers());
    console.log('copy after filter is' + copy);
    console.log('original is' + waitTimes);
    console.log('isoutlier: ' + !copy.includes(waitTime));
    return !copy.includes(waitTime);
}

function isValid(waitTimes) {
    // if there are less than 3 lineup times return false
    if (waitTimes.length < 3) {
        console.log("length < 3");
        return false;
    }
    // if the variance of the lineup times is too big return false
    // https://www.researchgate.net/post/What_do_you_consider_a_good_standard_deviation
    if (coefficientOfVariation(waitTimes) >= 1) {
        console.log("coeff of var >=1 ");
        return false;
    }
    // otherwise return true
    return true;
}

function coefficientOfVariation(lineupTimes) {
    return stats.stdev(lineupTimes) / stats.mean(lineupTimes);
}

// function updateLineup(id, body) {
//     return Lineup.findOneAndUpdate({id}, body, {upsert: true}).then(function (update) {
//         pushNotification.checkToSendPushNotification(body, id);
//         return update;
//     });
// }

function deleteLineup(id) {
    return Lineup.findOneAndDelete({id});
}

module.exports = {getLineupById, getLineupsAverageLineupTimesByIds, addLineup, deleteLineup};
