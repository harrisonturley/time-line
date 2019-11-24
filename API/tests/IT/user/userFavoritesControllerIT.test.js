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

// todo verify that subscriptions/unsubscriptions are being made

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
            name: 'Super Chef Grill',
            image_url: 'https://s3-media2.fl.yelpcdn.com/bphoto/Z7UPEekmVioWdtzRSMNIGA/o.jpg',
            is_closed: false,
            rating: 4.5,
            coordinates: {
                latitude: 49.279012421188,
                longitude: -123.116581099631
            },
            location: {
                display_address: [
                    '280 Robson Street',
                    'Vancouver, BC V6B 0E7',
                    'Canada'
                ]
            },
            distance: 507.3463646289611,
            lineupTime: null,
            timestamp: 1674378529
        };
        favorites.push(newFavoriteRestaurant.id);

        const res = await request.post('/api/users/' + email + '/favorites')
            .send({
                restaurant: newFavoriteRestaurant,
                registrationToken: 'cy8jM7xce84:APA91bF0O6qwjQf7SRji1p4t5jhK26pwnzNIso3s9HVJz4fsgYbZ2wGHtEnM0Qtt-oiJKgE_HXHFVZ1chXAExqRx0HbSCwrwhrdk-tFWN1Is8jHVlACVVO5PV7XwT_03qs9D_vnAGLb-'
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
        delete newFavoriteRestaurant.lineupTime;
        expect(favoritedRestaurant).toEqual(newFavoriteRestaurant);
        done();
    });

    it('deletes an existing user favorite', async done => {
        const seededUser = userSeeds[2];
        const email = seededUser.email;
        const favorites = seededUser.favorites;
        const favoriteToDelete = favorites[0];
        utils.removeFromArray(favorites, favoriteToDelete);

        const res = await request.delete('/api/users/' + email + '/favorites/' + favoriteToDelete)
            .send({
                registrationToken: 'cy8jM7xce84:APA91bF0O6qwjQf7SRji1p4t5jhK26pwnzNIso3s9HVJz4fsgYbZ2wGHtEnM0Qtt-oiJKgE_HXHFVZ1chXAExqRx0HbSCwrwhrdk-tFWN1Is8jHVlACVVO5PV7XwT_03qs9D_vnAGLb-'
            });
        expect(res.status).toBe(422);
        // expect(res.body.favorites).toEqual(favorites);
        // expect(res.body).not.toHaveProperty('email');
        // expect(res.body).not.toHaveProperty('name');
        // expect(res.body).not.toHaveProperty('balance');
        // const userFavorites = await User.findOne({email}, {_id: 0, favorites: 1}).lean();
        // expect(userFavorites.favorites).toEqual(favorites);
        // const favoritedRestaurantExists = await FavoritedRestaurant.exists(
        //     {id: favoriteToDelete},
        //     {_id: 0, __v: 0}
        // );
        // expect(favoritedRestaurantExists).toBe(true);
        done();
    });
});
