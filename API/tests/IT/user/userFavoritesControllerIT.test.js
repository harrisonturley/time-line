const app = require('../../../server');
const supertest = require('supertest');
const request = supertest(app);
const {setupDB} = require('../test-setup');
const databaseName = 'userFavoritesControllerITDB';
const User = require('../../../repository/user');
const userSeeds = require('../seeds/user.seed.js');
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
        const newFavorite = uuid.v1();
        favorites.push(newFavorite);

        const res = await request.post('/api/users/' + email + '/favorites')
            .send({
                favorite: newFavorite
            });

        expect(res.status).toBe(200);
        expect(res.body.favorites).toEqual(favorites);
        expect(res.body).not.toHaveProperty('email');
        expect(res.body).not.toHaveProperty('name');
        expect(res.body).not.toHaveProperty('balance');
        const user = await User.findOne({email: email}).lean();
        expect(user.favorites).toEqual(favorites);
        done();
    });

    it('deletes an existing user favorite', async done => {
        const seededUser = userSeeds[2];
        const email = seededUser.email;
        const favorites = seededUser.favorites;
        const favoriteToDelete = favorites[1];
        utils.removeFromArray(favorites, favoriteToDelete);

        const res = await request.delete('/api/users/' + email + '/favorites/' + favoriteToDelete);

        expect(res.status).toBe(200);
        expect(res.body.favorites).toEqual(favorites);
        expect(res.body).not.toHaveProperty('email');
        expect(res.body).not.toHaveProperty('name');
        expect(res.body).not.toHaveProperty('balance');
        const userFavorites = await User.findOne({email}, {_id: 0, favorites: 1}).lean();
        expect(userFavorites.favorites).toEqual(favorites);
        done();
    });
});
