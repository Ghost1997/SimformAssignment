const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const router = express.Router();
const route = require("./routes/route");
const morgan = require("morgan");
const routeNotFound = require("./controllers/404Controller");

app.use(morgan("dev"));
mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0-jne8p.mongodb.net/test?authSource=admin&replicaSet=Cluster0-shard-0&readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=true",
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log("DB Connected");
    console.log("server on http://localhost:8080");
  })
  .catch(() => {
    console.log("DB Connection failed");
  });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", route);
app.use(routeNotFound.get404);
app.listen(8080);

module.exports = router;
module.exports = app;
