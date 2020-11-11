mongoose = require("mongoose");
const { default: ShortUniqueId } = require('short-unique-id');

// Database URL
const DATABASE = "mongodb://localhost/short";
mongoose.connect(DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("error", (err) => {
  console.log("Mongoose Connection error" + err.message);
});

mongoose.connection.once("open", () => {
  console.log("MongoDB connected");
});

// Import Model
require("./model");

const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const Url = mongoose.model("Url");

// Create Routes
app.get("/", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/html",
  });
  fs.readFile("./views/home.html", null, function (error, data) {
    if (error) {
      res.writeHead(404);
      res.write("Route not found!");
    } else {
      res.write(data);
    }
    res.end();
  });
});

app.get("/:route", async (req, res) => {
  const route = req.params.route;
  const instance = await Url.findOne({ id: route });
  console.log(route)
  console.log(instance);
  if (instance) {
    instance.visitors = instance.visitors + 1;
    await instance.save();
    res.redirect(`${instance.url}`);
  } else {
    res.send("404");
  }
});

app.get("/analytics/:route", async (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/html",
  });
  fs.readFile("./views/count.html", null, function (error, data) {
    if (error) {
      res.writeHead(404);
      res.write("Route not found!");
    } else {
      res.write(data);
    }
    res.end();
  });
});

app.post("/analytics", async (req, res) => {
  const route = req.body.route;
  const instance = await Url.findOne({ id: route });
  res.send({
    visitors: instance.visitors,
    message: "Number of visitors sent!",
  });
});

app.post("/", async (req, res) => {
  const url = req.body.url;
  console.log(url);
  const instance = new Url({
    url: url,
    visitors: 0,
  });
  short = JSON.stringify(instance._id);
  //const id = short.slice(short.length-7, short.length-1)
  const uid = new ShortUniqueId()
  const id =uid(5);
  console.log(id)
  const searchID = await Url.findOne({ id: id });
  console.log(id);
  if (searchID === null) {
    instance.id = id;
    await instance.save();
    res.send({
      message: `${id} was created`,
      url: `${id}`,
    });
  }
  if (searchID.id === id) return res.send({ message: "ya existe" });
});

app.listen(process.env.PORT || 8000, () => {
  console.log("Listening on port 8000");
});
