const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FavoritedRestaurantSchema = new Schema({
    // id must be the Yelp API's restaurant id
    id: {
        type: String,
        unique: true,
        required: true
    },
    alias: {
        type: String,
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
    url: {
        type: String,
        required: true
    },
    review_count: {
        type: Number,
        required: true
    },
    categories: {
        type: [{
            _id: false,
            alias: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            }
        }],
        required: true,
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
    transactions: {
        type: [String],
        required: true
    },
    price: {
        type: String,
        required: true
    },
    location: {
        type: {
            address1: {
                type: String,
                required: true
            },
            address2: {
                type: String,
                required: true
            },
            address3: {
                type: String,
                required: true
            },
            city: {
                type: String,
                required: true
            },
            zip_code: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            display_address: {
                type: [String],
                required: true
            }
        },
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    display_phone: {
        type: String,
        required: true
    },
    distance: {
        type: Number,
        required: true
    },
    lineupTime: {
        type: Number,
    },
    timestamp: {
        type: Number,
        required: true
    }
});

const Lineup = mongoose.model("favoritedRestaurant", FavoritedRestaurantSchema);

module.exports = Lineup;
