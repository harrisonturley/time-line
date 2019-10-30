const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LineupSchema = new Schema({
    // id must be the Yelp API's restaurant id
    id: {
        type: String,
        unique: true,
        required: true
    },
    lineupTime: {
        type: Number,
        required: true
    }
});

const Lineup = mongoose.model("lineup", LineupSchema);

module.exports = Lineup;
