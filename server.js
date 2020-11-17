const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

// simple route
app.get("/sraban", (req, res) => {
  var data = { 
  		message: "Welcome to bezkoder application.",
  		status: "400",
  		description: {
  			name : "sraban Kumar Pahadasingh"
  		}
  	};
  res.json(data);
});


// MVC
require("./app/routes/customer.routes.js")(app);

// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});