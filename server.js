const express = require("express");
const bodyParser = require("body-parser");
// require('./apis/config/db-check');
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
const server = app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});

app.get('/shutdown-server', (req,res)=>{
    // process.exit(0);
    res.redirect('/');
    server.close();
})

app.server = server;


module.exports = app;

