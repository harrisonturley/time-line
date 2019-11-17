const Lineup = require("../repository/lineup");
const pushNotification = require("./notificationService");

function getLineupById(id) {
    return Lineup.findOne({id});
}

function getLineupsByIds(ids) {
    return Lineup.find({id: {$in: ids}});
}

function addLineup(body) {
    return Lineup.create(body);
}

function updateLineup(id, body) {
    return Lineup.findOneAndUpdate({id}, body, {upsert: true}).then(function (update) {
        pushNotification.checkToSendPushNotification(body, id);
        return update;
    });
}

function deleteLineup(id) {
    return Lineup.findOneAndDelete({id});
}

module.exports = {getLineupById, getLineupsByIds, addLineup, updateLineup, deleteLineup};
