const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const checkAuth = require("../controllers/check_Auth");

router.post("/adminLogin", userController.adminLogin);
router.post("/createAgent", checkAuth, userController.createAgent);
router.get("/getAgent", checkAuth, userController.viewAgent);
router.post("/agentLogin", userController.agentLogin);
router.post("/createSite", checkAuth, userController.createSite);
router.get("/getSite", checkAuth, userController.viewSite);
router.post("/siteLogin", userController.siteLogin);
router.post("/createCashier", checkAuth, userController.createCashier);
router.get("/getCashier", checkAuth, userController.viewCashier);
module.exports = router;
