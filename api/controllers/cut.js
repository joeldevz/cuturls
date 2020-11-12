"use strict";
//REQUIRE MODULES
require("../models/urls");
const Url = mongoose.model("Url");
const { default: ShortUniqueId } = require("short-unique-id");
//FUNCTIONS
const redirectUrl = async (req, res) => {
  const route = req.params.route;
  const instance = await Url.findOne({ id: route });
  if (instance) {
    instance.visitors = instance.visitors + 1;
    await instance.save();
    res.redirect(`${instance.url}`);
  } else {
    res.send("404");
  }
};
const analyticUrl = async (req, res) => {
  const route = req.body.route;
  const instance = await Url.findOne({ id: route });
  res.send({
    visitors: instance.visitors,
    message: "Number of visitors sent!",
  });
};
const saveUrl = async (req, res) => {
  const url = req.body.url;
  const instance = new Url({
    url: url,
    visitors: 0,
  });
  const uid = new ShortUniqueId();
  const id = uid(5);
  const searchID = await Url.findOne({ id: id });
  if (searchID === null) {
    instance.id = id;
    await instance.save();
    return res.send({
      message: `${id} was created`,
      url: `${id}`,
    });
  }
  if (searchID.id === id) return res.json("ya existe");
};
const getAnalytics = async (req, res) => {
  const searchID = await Url.findOne({ id: req.params.route });
  searchID._id = null;
  searchID.__v = null;
  res.status(200).json(searchID);
};
module.exports = {
  redirectUrl,
  analyticUrl,
  saveUrl,
  getAnalytics,
};
