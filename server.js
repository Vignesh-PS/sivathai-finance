const express = require("express");
const bodyParser = require("body-parser");
var cors = require('cors')

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Hello sangs." });
});

require("./apis/routes/all.routes.js")(app);
// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});
