const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const checkAuth = require("../controllers/check_Auth");

router.post("/createAdmin", userController.createAdmin);
router.post("/adminLogin", userController.adminLogin);
router.post("/createAgent", checkAuth, userController.createAgent);

module.exports = router;
