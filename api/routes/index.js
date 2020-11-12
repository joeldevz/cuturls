"use strict";
//REQUIRE MODULES
const express = require("express");
const api = express.Router();
const CtrlCut = require("../controllers/cut");
//SET ROUTES
api.get("/:route", CtrlCut.redirectUrl);
api.post("/analytics", CtrlCut.analyticUrl);
api.post("/", CtrlCut.saveUrl);
api.get("/analytics/:route", CtrlCut.getAnalytics);
module.exports = api;
