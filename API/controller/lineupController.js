const express = require("express");
const router = express.Router();
const lineupService = require("../service/lineupService");

router.get("/lineups/:id", function (req, res, next) {
    lineupService.getLineupById(req.params.id).then(function (lineup) {
        res.send(lineup);
    }).catch(next);
});

router.post("/lineups/:id", function (req, res, next) {
    lineupService.addLineup(req.params.id, req.body.lineupTime).then(function (lineup) {
        console.log(lineup);
        res.send(lineup);
    }).catch(next);
});

// router.put("/lineups/:id", function (req, res, next) {
//     lineupService.updateLineup(req.params.id, req.body).then(function (lineup) {
//         //  need to return the UPDATED lineup, not the found one
//         lineupService.getLineupById(req.params.id).then(function (updatedLineup) {
//             res.send(updatedLineup);
//         });
//     }).catch(next);
// });

router.delete("/lineups/:id", function (req, res, next) {
    lineupService.deleteLineup(req.params.id).then(function (lineup) {
        res.send(lineup);
    }).catch(next);
});

module.exports = router;
