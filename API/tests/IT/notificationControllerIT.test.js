const app = require('../../server');
const supertest = require('supertest');
const request = supertest(app);
const {setupDB} = require('./test-setup');
const databaseName = 'notificationControllerITDB';

// create a test database specific to this test file & seed it with data
setupDB(databaseName, true);

describe("notificationController", () => {
    it('responds with a 422 error if subscribing with an invalid registration token', async done => {
        const res = await request.post('/api/notification/subscribe')
            .send({
                registrationToken: 'invalidToken'
            });

        expect(res.status).toBe(422);
        done();
    });

    it('subscribes users to a general topic', async done => {
        const res = await request.post('/api/notification/subscribe')
            .send({
                registrationToken: 'WavvLdfdP6g8aZTtbBQHTw'
            });

        // todo change to 200 once you have a valid registration token
        expect(res.status).toBe(422);
        done();
    });
});
