const express = require("express");
const apiController = require(`${__dirname}/../controllers/apiController`);

const router = express.Router();

router.route("/register").post(apiController.signup);
router.route("/login").post(apiController.login);

module.exports = router;
