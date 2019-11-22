const app = require('../../server');
const supertest = require('supertest');
const request = supertest(app);
const {setupDB} = require('./test-setup');
const databaseName = 'lineupControllerITDB';
const Lineup = require('../../repository/lineup');
const lineupSeeds = require('./seeds/lineup.seed.js');
const uuid = require('uuid');

describe("lineupController", () => {
    // create a test database specific to this test file & seed it with data
    setupDB(databaseName);

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
        console.log(await Lineup.find({}));
        const id = 'uW6NtwN8hxrOLMyPi9IVcA';
        const lineupTime = getRandomIntInclusive(0, 100);

        const res = await request.post('/api/lineups/' + id)
            .send({
                lineupTime: lineupTime
            });

        expect(res.status).toBe(200);
        // console.log(await Lineup.find({}));
        // const lineup = await Lineup.findOne({id: id});
        // expect(lineup.id).toBe(id);
        // expect(lineup.lineupTime).toBe(lineupTime);
        expect(res.body.id).toBe(id);
        expect(res.body.lineupTime).toBe(6969);
        done();
    });

    it('adds new lineups', async done => {
        const id = 'uW6NtwN8hxrOLMyPi9IVcA';
        const lineupTime1 = 30;
        const lineupTime2 = 31;
        const lineupTime3 = 29;
        const expectedLineupTime = (lineupTime1+lineupTime2+lineupTime3)/3;

        const res1 = await request.post('/api/lineups/' + id)
            .send({
                lineupTime: lineupTime1
            });
        const res2 = await request.post('/api/lineups/' + id)
            .send({
                lineupTime: lineupTime2
            });
        const res3 = await request.post('/api/lineups/' + id)
            .send({
                lineupTime: lineupTime3
            });

        expect(res1.status).toBe(200);
        expect(res2.status).toBe(200);
        expect(res3.status).toBe(200);
        // const lineup = await Lineup.findOne({id: id});
        // console.log(lineup);
        // expect(lineup.id).toBe(id);
        // expect(lineup.averageLineupTime).toBe(expectedLineupTime);
        expect(res1.body.id).toBe(id);
        expect(res1.body.lineupTime).toBe(6969);
        expect(res2.body.id).toBe(id);
        expect(res2.body.lineupTime).toBe(6969);
        expect(res3.body.id).toBe(id);
        expect(res3.body.lineupTime).toBe(expectedLineupTime);
        done();
    });

    // it('updates an existing lineup', async done => {
    //     const seededLineup = lineupSeeds[1];
    //     const id = seededLineup.id;
    //     const newLineUpTime = getRandomIntInclusive(0, 100);
    //
    //     const res = await request.put('/api/lineups/' + id)
    //         .send({
    //             lineupTime: newLineUpTime
    //         });
    //
    //     expect(res.status).toBe(200);
    //     const lineup = await Lineup.findOne({id: id});
    //     expect(lineup.id).toBe(id);
    //     expect(lineup.lineupTime).toBe(newLineUpTime);
    //     expect(res.body.id).toBe(id);
    //     expect(res.body.lineupTime).toBe(newLineUpTime);
    //     done();
    // });

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
});

// source: Mozilla MDN docs
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}
