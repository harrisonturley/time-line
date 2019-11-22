const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LineupSchema = new Schema({
    // id must be the Yelp API's restaurant id
    id: {
        type: String,
        unique: true,
        required: true
    },
    // holds last 10 lineup times
    lineupTimes: {
        type: [{
            _id: false,
            waitTime: {
                type: Number,
                required: true
            },
            timestamp: {
                type: Number,
                required: true
            }
        }],
        required: true,
        default: []
    },
    averageLineupTime: {
        _id: false,
        type: Number,
        required: true,
        default: null
    }
});

const Lineup = mongoose.model("lineup", LineupSchema);

module.exports = Lineup;
