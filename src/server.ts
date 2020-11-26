//@ts-ignore
var mongoose = require("mongoose");
var vhost = require("vhost");
const express = require("express");
const app = express();
const port = 8601;

// Models
require("./Utils/Models/SystemSettings");

mongoose.connect(`mongodb://${process.env.DBURL || "localhost:27017"}/AppBox`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;
db.once("open", async () => {
  // Models
  const systemsettings = mongoose.model("SystemSettings");

  const apps = await systemsettings.findOne({ key: "hosted_apps" });
  apps.value.map((appInfo) => {
    app.use(vhost(appInfo.url, express.static(appInfo.app)));
  });

  app.listen(port, () => {
    console.log(
      `App-Server is now listening for VHOST requests on http://localhost:${port}`
    );
  });

  console.log("App-Server initialising.");
});
