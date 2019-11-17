const app = require('../../server');
const supertest = require('supertest');
const request = supertest(app);
const {setupDB} = require('./test-setup');
const databaseName = 'userControllerITDB';
const User = require('../../repository/user');
const userSeeds = require('../seeds/user.seed.js');

// create a test database specific to this test file & seed it with data
setupDB(databaseName);

describe("userController", () => {
    it('reads an existing user', async done => {
        const seededUser = userSeeds[0];
        const email = seededUser.email;
        const name = seededUser.name;
        const balance = seededUser.balance;

        const res = await request.get('/api/users/' + email);

        expect(res.status).toBe(200);
        expect(res.body.email).toBe(email);
        expect(res.body.name).toBe(name);
        expect(res.body.balance).toBe(balance);
        done()
    });

    it('creates a new user', async done => {
        const email = "newUser@test.com";
        const name = "New User";
        const balance = 100;

        const res = await request.post('/api/users')
            .send({
                email: email,
                name: name,
                balance: balance
            });

        expect(res.status).toBe(200);
        const user = await User.findOne({email: email});
        expect(user.email).toBe(email);
        expect(user.name).toBe(name);
        expect(user.balance).toBe(balance);
        expect(res.body.email).toBe(email);
        expect(res.body.name).toBe(name);
        expect(res.body.balance).toBe(balance);
        done();
    });

    it('updates an existing user', async done => {
        const seededUser = userSeeds[1];
        const email = seededUser.email;
        const newName = "New Name";
        const newBalance = 500;

        const res = await request.put('/api/users/' + email)
            .send({
                name: newName,
                balance: newBalance
            });

        expect(res.status).toBe(200);
        const user = await User.findOne({email: email});
        expect(user.email).toBe(email);
        expect(user.name).toBe(newName);
        expect(user.balance).toBe(newBalance);
        expect(res.body.email).toBe(email);
        expect(res.body.name).toBe(newName);
        expect(res.body.balance).toBe(newBalance);
        done();
    });

    it('deletes an existing user', async done => {
        const seededUser = userSeeds[2];
        const email = seededUser.email;
        const name = seededUser.name;
        const balance = seededUser.balance;

        const res = await request.delete('/api/users/' + email);

        expect(res.status).toBe(200);
        const existsInDB = await User.exists({email: email});
        expect(existsInDB).toBe(false);
        expect(res.body.email).toBe(email);
        expect(res.body.name).toBe(name);
        expect(res.body.balance).toBe(balance);
        done();
    });
});
