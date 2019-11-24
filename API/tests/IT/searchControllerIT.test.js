const app = require('../../server');
const supertest = require('supertest');
const request = supertest(app);
const {setupDB} = require('./test-setup');
const databaseName = 'searchControllerITDB';
const favoritedRestaurantSeeds = require('./seeds/favoritedRestaurant.seed');

// create a test database specific to this test file & seed it with data
setupDB(databaseName);

describe("searchController", () => {
    it('gets 5 restaurants by keywords and coordinates', async done => {
        const keyword = 'chinese';
        const latitude = 49.2827;
        const longitude = -123.1207;

        const res = await request.get('/api/search/restaurants')
            .query({keyword: keyword, latitude: latitude, longitude: longitude});

        expect(res.status).toBe(200);
        expect(res.body.businesses).toHaveLength(5);
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

        const businessesRes = await (request.get('/api/search/restaurants')
            .query({keyword: keyword, latitude: latitude, longitude: longitude}));
        let businesses = businessesRes.body.businesses;

        console.log(businesses[0].id);
        console.log(businesses[1].id);
        console.log(businesses[2].id);

        const updateRes0 = await (request.put('/api/lineups/' + businesses[0].id)
            .send({
                lineupTime: updatedLineupTime0
            }));
        const updateRes1 = await (request.put('/api/lineups/' + businesses[1].id)
            .send({
                lineupTime: updatedLineupTime1
            }));
        const updateRes2 = await (request.put('/api/lineups/' + businesses[2].id)
            .send({
                lineupTime: updatedLineupTime2
            }));
        const updateRes3 = await (request.put('/api/lineups/' + businesses[0].id)
            .send({
                lineupTime: updatedLineupTime3
            }));
        const newBusinessesRes = await (request.get('/api/search/restaurants')
            .query({
                keyword: keyword, latitude: latitude, longitude: longitude
            }));
        let newBusinesses = newBusinessesRes.body.businesses;

        expect(businessesRes.status).toBe(200);
        expect(updateRes0.status).toBe(200);
        expect(updateRes1.status).toBe(200);
        expect(updateRes2.status).toBe(200);
        expect(updateRes3.status).toBe(200);
        expect(newBusinessesRes.status).toBe(200);
        expect(newBusinesses[0].lineupTime).toBe(null);
        expect(newBusinesses[1].lineupTime).toBe(null);
        // outlier case
        expect(newBusinesses[2].lineupTime).toBe(null);
        for (let i = 3; i < newBusinessesRes.length; i++) {
            expect(newBusinesses[i].lineupTime).toBeNull();
        }
        done();
    });

    it('gets favorited restaurants by ids', async done => {
        const ids = "[\"vnKoBdTuh2lsUKASMwQYbA\",\"JgSGpSMHbGecAXs_o1rE_g\", \"B3DOnmh1XLN_rW3Y105hvA\", \"invalidId\"]";
        const seededBusinesses = favoritedRestaurantSeeds;
        const expectedBusiness0 = seededBusinesses[0];
        expectedBusiness0.lineupTime = 0;
        const expectedBusiness1 = seededBusinesses[1];
        expectedBusiness1.lineupTime = 10.5;
        const expectedBusiness2 = seededBusinesses[3];
        expectedBusiness2.lineupTime = null;

        const res = await request.get('/api/search/restaurants/favorited')
            .query({restaurantIds: ids});
        let businesses = res.body.businesses;

        expect(res.status).toBe(200);
        expect(res.body.total).toBe(3);
        expect(businesses).toHaveLength(3);
        expect(businesses[0]).toEqual(expectedBusiness0);
        expect(businesses[1]).toEqual(expectedBusiness1);
        expect(businesses[2]).toEqual(expectedBusiness2);
        done();
    });

    it('gets favorited restaurants by ids with newly updated lineup times', async done => {
        const ids = "[\"vnKoBdTuh2lsUKASMwQYbA\",\"JgSGpSMHbGecAXs_o1rE_g\", \"invalidId\"]";
        const seededBusinesses = favoritedRestaurantSeeds;
        const addedLineupTime = 20;
        const expectedBusiness0 = seededBusinesses[0];
        expectedBusiness0.lineupTime = 0;
        const expectedBusiness1 = seededBusinesses[1];
        expectedBusiness1.lineupTime = 10.5;

        const businessesRes = await request.get('/api/search/restaurants/favorited')
            .query({restaurantIds: ids});
        const updateRes = await request.put('/api/lineups/' + seededBusinesses[1].id)
            .send({
                lineupTime: addedLineupTime
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
        expectedBusiness1.lineupTime = (addedLineupTime+ 10 + 11) / 3;
        done();
    });
});
