const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FavoritedRestaurantSchema = new Schema({
    // id must be the Yelp API's restaurant id
    id: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: true
    },
    is_closed: {
        type: Boolean,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    coordinates: {
        type: {
            latitude: {
                type: Number,
                required: true
            },
            longitude: {
                type: Number,
                required: true
            }
        },
        required: true
    },
    location: {
        type: {
            display_address: {
                type: [String],
                required: true
            }
        },
        required: true
    },
    distance: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Number,
        required: true
    }
});

const Lineup = mongoose.model("favoritedRestaurant", FavoritedRestaurantSchema);

module.exports = Lineup;
