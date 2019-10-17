const Lineup = require('../repository/lineup');
const pushNotification = require('../pushNotification/pushNotification');

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
    pushNotification.checkToSendPushNotification(body);
    return Lineup.findOneAndUpdate({id: id}, body);
}

function deleteLineup(id) {
    return Lineup.findOneAndDelete({id: id});
}

module.exports = {getLineupById, getLineupsByIds, addLineup, updateLineup, deleteLineup};