const express = require("express");
const router = express.Router();
const lineupService = require("../service/lineupService");
const popTimes = require("../service/popularTimesService");

router.get("/lineups/:id", function (req, res, next) {
    /*lineupService.getLineupById(req.params.id).then(function (lineup) {
        res.send(lineup);
    }).catch(next);*/
    lineupService.getLineupById(req.params.id, req.body).then(function (lineup) {
        popTimes.getPopularTimes(req.params.id).then(function (updatedLineup) {
            res.send(updatedLineup);
        });
    }).catch(next);
});

router.post("/lineups", function (req, res, next) {
    lineupService.addLineup(req.body).then(function (lineup) {
        res.send(lineup);
    }).catch(next);
});

router.put("/lineups/:id", function (req, res, next) {
    lineupService.updateLineup(req.params.id, req.body).then(function (lineup) {
        //  need to return the UPDATED lineup, not the found one
        lineupService.getLineupById(req.params.id).then(function (updatedLineup) {
            res.send(updatedLineup);
        });
    }).catch(next);
});

router.delete("/lineups/:id", function (req, res, next) {
    lineupService.deleteLineup(req.params.id).then(function (lineup) {
        res.send(lineup);
    }).catch(next);
});

module.exports = router;
