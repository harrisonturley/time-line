const Lineup = require('../repository/lineup');

function getLineupById(id) {
    return Lineup.findOne({id: id});
}

function addLineup(body) {
    return Lineup.create(body);
}

function updateLineup(id, body) {
    return Lineup.findOneAndUpdate({id: id}, body);
}

function deleteLineup(id) {
    return Lineup.findOneAndDelete({id: id});
}

module.exports = {getLineupById, addLineup, updateLineup, deleteLineup};