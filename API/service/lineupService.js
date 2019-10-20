const Lineup = require('../repository/lineup');
const pushNotification = require('./notificationService');

function getLineupById(id) {
    return Lineup.findOne({id: id});
}

function getLineupsByIds(ids) {
    return Lineup.find({id: {$in: ids}});
}

function addLineup(body) {
    return Lineup.create(body);
}

function updateLineup(id, body) {
    return Lineup.findOneAndUpdate({id: id}, body).then(function (update) {
        pushNotification.checkToSendPushNotification(body, id);
    });
}

function deleteLineup(id) {
    return Lineup.findOneAndDelete({id: id});
}

module.exports = {getLineupById, getLineupsByIds, addLineup, updateLineup, deleteLineup};