const app = require('../../../server');
const supertest = require('supertest');
const request = supertest(app);
const {setupDB} = require('../test-setup');
const databaseName = 'userFavoritesControllerITDB';
const User = require('../../../repository/user');
const FavoritedRestaurant = require('../../../repository/favoritedRestaurant');
const userSeeds = require('../seeds/user.seed.js');
const favoritedRestaurantSeeds = require('../seeds/favoritedRestaurant.seed');
const uuid = require('uuid');
const utils = require("../../../util/collections");

// create a test database specific to this test file & seed it with data
setupDB(databaseName);

describe("userFavoritesController", () => {
    it('reads an existing user favorites', async done => {
        const seededUser = userSeeds[0];
        const email = seededUser.email;
        const favorites = seededUser.favorites;

        const res = await request.get('/api/users/' + email + '/favorites');

        expect(res.status).toBe(200);
        expect(res.body.favorites).toEqual(favorites);
        expect(res.body).not.toHaveProperty('email');
        expect(res.body).not.toHaveProperty('name');
        expect(res.body).not.toHaveProperty('balance');
        done()
    });

    it('creates a new user favorite', async done => {
        const seededUser = userSeeds[0];
        const email = seededUser.email;
        const favorites = seededUser.favorites;
        const newFavoriteRestaurant = {
            id: 'vtGxOG7DVS7ftBzRW94uDA',
            alias: 'super-chef-grill-vancouver',
            name: 'Super Chef Grill',
            image_url: 'https://s3-media2.fl.yelpcdn.com/bphoto/Z7UPEekmVioWdtzRSMNIGA/o.jpg',
            is_closed: false,
            url: 'https://www.yelp.com/biz/super-chef-grill-vancouver?adjust_creative=2ojO4ZImtGy71cMqoKgOQw&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=2ojO4ZImtGy71cMqoKgOQw',
            review_count: 68,
            categories: [
                {
                    alias: 'chinese',
                    title: 'Chinese'
                }
            ],
            rating: 4.5,
            coordinates: {
                latitude: 49.279012421188,
                longitude: -123.116581099631
            },
            transactions: [],
            price: '$',
            location: {
                address1: '280 Robson Street',
                address2: '',
                address3: '',
                city: 'Vancouver',
                zip_code: 'V6B 0E7',
                country: 'CA',
                state: 'BC',
                display_address: [
                    '280 Robson Street',
                    'Vancouver, BC V6B 0E7',
                    'Canada'
                ]
            },
            phone: '+16048282083',
            display_phone: '+1 604-828-2083',
            distance: 507.3463646289611,
        };
        favorites.push(newFavoriteRestaurant.id);

        const res = await request.post('/api/users/' + email + '/favorites')
            .send({
                restaurant: newFavoriteRestaurant
            });

        expect(res.status).toBe(200);
        expect(res.body.favorites).toEqual(favorites);
        expect(res.body).not.toHaveProperty('email');
        expect(res.body).not.toHaveProperty('name');
        expect(res.body).not.toHaveProperty('balance');
        const user = await User.findOne({email: email}).lean();
        expect(user.favorites).toEqual(favorites);
        const favoritedRestaurant = await FavoritedRestaurant.findOne(
            {id: newFavoriteRestaurant.id},
            {_id: 0, __v: 0}
        ).lean();
        expect(favoritedRestaurant).toEqual(newFavoriteRestaurant);
        done();
    });

    it('deletes an existing user favorite', async done => {
        const seededUser = userSeeds[2];
        const email = seededUser.email;
        const favorites = seededUser.favorites;
        const favoriteToDelete = favorites[0];
        utils.removeFromArray(favorites, favoriteToDelete);

        const res = await request.delete('/api/users/' + email + '/favorites/' + favoriteToDelete);

        expect(res.status).toBe(200);
        expect(res.body.favorites).toEqual(favorites);
        expect(res.body).not.toHaveProperty('email');
        expect(res.body).not.toHaveProperty('name');
        expect(res.body).not.toHaveProperty('balance');
        const userFavorites = await User.findOne({email}, {_id: 0, favorites: 1}).lean();
        expect(userFavorites.favorites).toEqual(favorites);
        const favoritedRestaurantExists = await FavoritedRestaurant.exists(
            {id: favoriteToDelete},
            {_id: 0, __v: 0}
        );
        expect(favoritedRestaurantExists).toBe(true);
        done();
    });
});
