const app = require('../../server');
const supertest = require('supertest');
const request = supertest(app);
const {setupDB} = require('./test-setup');
const databaseName = 'lineupControllerITDB';
const Lineup = require('../../repository/lineup');
const lineupSeeds = require('../seeds/lineup.seed.js');
const uuid = require('uuid');

// create a test database specific to this test file & seed it with data
setupDB(databaseName);

describe("lineupController", () => {
    it('reads an existing lineup', async done => {
        const seededLineup = lineupSeeds[0];
        const id = seededLineup.id;
        const lineupTime = seededLineup.lineupTime;

        const res = await request.get('/api/lineups/' + id);

        expect(res.status).toBe(200);
        expect(res.body.id).toBe(id);
        expect(res.body.lineupTime).toBe(lineupTime);
        done()
    });

    it('creates a new lineup', async done => {
        const id = uuid.v1();
        const lineupTime = getRandomIntInclusive(0, 100);

        const res = await request.post('/api/lineups')
            .send({
                id: id,
                lineupTime: lineupTime
            });

        expect(res.status).toBe(200);
        const lineup = await Lineup.findOne({id: id});
        expect(lineup.id).toBe(id);
        expect(lineup.lineupTime).toBe(lineupTime);
        expect(res.body.id).toBe(id);
        expect(res.body.lineupTime).toBe(lineupTime);
        done();
    });

    it('updates an existing lineup', async done => {
        const seededLineup = lineupSeeds[1];
        const id = seededLineup.id;
        const newLineUpTime = getRandomIntInclusive(0, 100);

        const res = await request.put('/api/lineups/' + id)
            .send({
                lineupTime: newLineUpTime
            });

        expect(res.status).toBe(200);
        const lineup = await Lineup.findOne({id: id});
        expect(lineup.id).toBe(id);
        expect(lineup.lineupTime).toBe(newLineUpTime);
        expect(res.body.id).toBe(id);
        expect(res.body.lineupTime).toBe(newLineUpTime);
        done();
    });

    it('deletes an existing lineup', async done => {
        const seededLineup = lineupSeeds[2];
        const id = seededLineup.id;
        const lineupTime = seededLineup.lineupTime;

        const res = await request.delete('/api/lineups/' + id);

        expect(res.status).toBe(200);
        const existsInDB = await Lineup.exists({id: id});
        expect(existsInDB).toBe(false);
        expect(res.body.id).toBe(id);
        expect(res.body.lineupTime).toBe(lineupTime);
        done();
    });

    // source: Mozilla MDN docs
    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
    }
});
