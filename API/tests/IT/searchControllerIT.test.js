const app = require('../../server');
const supertest = require('supertest');
const request = supertest(app);
const {setupDB} = require('./test-setup');
const databaseName = 'searchControllerITDB';
const favoritedRestaurantSeeds = require('./seeds/favoritedRestaurant.seed');

// create a test database specific to this test file & seed it with data
setupDB(databaseName, true);

describe("searchController", () => {
    it('gets 20 restaurants by keywords and coordinates', async done => {
        const keyword = 'chinese';
        const latitude = 49.2827;
        const longitude = -123.1207;

        const res = await request.get('/api/search/restaurants')
            .query({keyword: keyword, latitude: latitude, longitude: longitude});

        expect(res.status).toBe(200);
        expect(res.body.businesses).toHaveLength(20);
        expect(res.body.region.center.latitude).toBe(49.2827);
        expect(res.body.region.center.longitude).toBe(-123.1207);
        done();
    });

    it('gets restaurants with newly updated lineup times', async done => {
        const keyword = 'chinese';
        const latitude = 49.2827;
        const longitude = -123.1207;
        const updatedLineupTime0 = 5;
        const updatedLineupTime1 = 10;
        const updatedLineupTime2 = 15;
        const updatedLineupTime3 = 20;

        const businessesRes = await request.get('/api/search/restaurants')
            .query({keyword: keyword, latitude: latitude, longitude: longitude});
        let businesses = businessesRes.body.businesses;

        const updateRes0 = await request.post('/api/lineups')
            .send({
                id: businesses[0].id,
                lineupTime: updatedLineupTime0
            });
        const updateRes1 = await request.post('/api/lineups')
            .send({
                id: businesses[1].id,
                lineupTime: updatedLineupTime1
            });
        // allowed to do a put here because of upsert
        const updateRes2 = await request.put('/api/lineups/' + businesses[2].id)
            .send({
                lineupTime: updatedLineupTime2
            });
        const updateRes3 = await request.put('/api/lineups/' + businesses[0].id)
            .send({
                lineupTime: updatedLineupTime3
            });
        const newBusinessesRes = await request.get('/api/search/restaurants')
            .query({
                keyword: keyword, latitude: latitude, longitude: longitude
            });
        let newBusinesses = newBusinessesRes.body.businesses;

        expect(businessesRes.status).toBe(200);
        for(let i = 0; i < newBusinessesRes.length; i++){
            expect(businesses[i].lineupTime).toBeNull();
        }
        expect(updateRes0.status).toBe(200);
        expect(updateRes1.status).toBe(200);
        expect(updateRes2.status).toBe(200);
        expect(updateRes3.status).toBe(200);
        expect(newBusinessesRes.status).toBe(200);
        expect(newBusinesses[0].lineupTime).toBe(updatedLineupTime3);
        expect(newBusinesses[1].lineupTime).toBe(updatedLineupTime1);
        expect(newBusinesses[2].lineupTime).toBe(updatedLineupTime2);
        for(let i = 3; i < newBusinessesRes.length; i++){
            expect(newBusinesses[i].lineupTime).toBeNull();
        }
        done();
    });

    it('gets favorited restaurants by ids', async done => {
        const ids = "[\"vnKoBdTuh2lsUKASMwQYbA\",\"JgSGpSMHbGecAXs_o1rE_g\", \"invalidId\"]";
        const seededBusinesses = favoritedRestaurantSeeds;
        const expectedBusiness0 = seededBusinesses[0];
        expectedBusiness0.lineupTime = 40;
        const expectedBusiness1 = seededBusinesses[1];
        expectedBusiness1.lineupTime = 50;

        const res = await request.get('/api/search/restaurants/favorited')
            .query({restaurantIds: ids});
        let businesses = res.body.businesses;

        expect(res.status).toBe(200);
        expect(res.body.total).toBe(2);
        expect(businesses).toHaveLength(2);
        expect(businesses[0]).toEqual(seededBusinesses[0]);
        expect(businesses[1]).toEqual(seededBusinesses[1]);
        done();
    });

    it('gets favorited restaurants by ids with updated lineup times', async done => {
        const ids = "[\"vnKoBdTuh2lsUKASMwQYbA\",\"JgSGpSMHbGecAXs_o1rE_g\", \"invalidId\"]";
        const seededBusinesses = favoritedRestaurantSeeds;
        const updatedLineupTime = 20;
        const expectedBusiness0 = seededBusinesses[0];
        expectedBusiness0.lineupTime = 40;
        const expectedBusiness1 = seededBusinesses[1];
        expectedBusiness1.lineupTime = 50;

        const businessesRes = await request.get('/api/search/restaurants/favorited')
            .query({restaurantIds: ids});
        const updateRes = await request.put('/api/lineups/' + 'JgSGpSMHbGecAXs_o1rE_g')
            .send({
                lineupTime: updatedLineupTime
            });
        let businesses = businessesRes.body.businesses;
        const newBusinessesRes = await request.get('/api/search/restaurants/favorited')
            .query({restaurantIds: ids});
        let newBusinesses = newBusinessesRes.body.businesses;
        console.log(newBusinesses);

        expect(businessesRes.status).toBe(200);
        expect(updateRes.status).toBe(200);
        expect(newBusinessesRes.status).toBe(200);
        expect(businessesRes.body.total).toBe(2);
        expect(newBusinessesRes.body.total).toBe(2);
        expect(businesses).toHaveLength(2);
        expect(newBusinesses).toHaveLength(2);
        expect(businesses[0]).toEqual(expectedBusiness0);
        expect(businesses[1]).toEqual(expectedBusiness1);
        expectedBusiness1.lineupTime = updatedLineupTime;
        expect(newBusinesses[0]).toEqual(expectedBusiness0);
        expect(newBusinesses[1]).toEqual(expectedBusiness1);
        done();
    });
});
