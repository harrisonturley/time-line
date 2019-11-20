const express = require("express");
const router = express.Router();
const userService = require("../../service/user/userFavoritesService");

router.get("/users/:email/favorites", function (req, res, next) {
    userService.getUserFavorites(req.params.email).then(function (favorites) {
        res.send(favorites);
    }).catch(next);
});

router.post("/users/:email/favorites", function (req, res, next) {
    userService.addUserFavorite(req.params.email, req.body.favorite).then(function (favorites) {
        res.send(favorites);
    }).catch(next);
});

// favorite = yelp restaurant id
router.delete("/users/:email/favorites/:favorite", function (req, res, next) {
    userService.deleteUserFavorite(req.params.email, req.params.favorite).then(function (favorites) {
        res.send(favorites);
    }).catch(next);
});

module.exports = router;
