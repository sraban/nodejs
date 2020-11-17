const express = require("express");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
const cors = require('cors');
const morgan = require('morgan');
const _ = require('lodash');



const app = express();

app.use(cors());

app.use(fileUpload({
  createParentPath: true,
  limits: {
      fileSize: 20 * 1024 * 1024 * 1024 //20MB max file(s) size
  },
}));

app.use(express.static('upload')); // files available in teh url path

// parse requests of content-type: application/json
app.use(bodyParser.json());
// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser({ keepExtensions: true, uploadDir: "upload" }));

app.use(morgan('dev')); // checking the logs


const port = process.env.PORT || 3000;
const base_url = 'http://localhost:'+port;


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

app.post("/sraban", (req, res) => {
  console.log(req.params, req.body);
  res.json(req.body);
  //res.send(req.body);
});

app.put("/sraban", (req, res) => {
  console.log(req.params, req.body);
  res.send(req.body);
});


app.delete("/sraban:customerId", (req, res) => {
  console.log(req.params, req.body);
  res.send(req.body);
});

// simple database -------------------------------------------------
// simple database connection ---------------------------------------
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

const mysql = require("mysql");
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'secret',
  database: 'learn'
});

con.connect(error => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

// operation
// Fetch Record from Database
app.get("/sraban_db", (req, res) => {

    var customerId = 1;
    con.query(`SELECT * FROM customers WHERE id = ${customerId}`, (err, output) => {
        let data;
        if (err) data = err;
        if (output.length) data = output[0];
        res.json(data);
    });

});

app.get("/sraban_get_all", (req, res) => {

    con.query('SELECT * FROM customers', (err, output) => {
        let data;
        if (err) data = err;
        if (output.length) data = output;
        res.json(data);
    });

});

app.delete("/sraban_del", (req, res) => {
    var customerId = 1;
    con.query("DELETE FROM customers WHERE id = ?", customerId, (err, output) => {
        let data;
        if (err) data = err;
        if (output.affectedRows) data = `deleted ${output.affectedRows} customers`;
        res.json(data);
    });
});

app.delete("/sraban_del_all", (req, res) => {
    con.query("DELETE FROM customers", (err, output) => {
      let data;
      if (err) data = err;
      if (output.affectedRows) data = `deleted ${output.affectedRows} customers`;
      res.json(data);
    });
});


app.post("/sraban_insert", (req, res) => {

    let newCustomer = {
        name:'Arun',
        email:'pvt.arun@gmail.com',
        active:'1'
    };

    con.query("INSERT INTO customers SET ?", newCustomer, (err, output) => {
        let data;
        if (err) data = err;
        if (output) data = { id: output.insertId, ...newCustomer };
        res.json(data);
    });
});


app.put("/sraban_update", (req, res) => {
    let id = '1';
    let customer = {
        name:'Santosh',
        email:'pvt.santosh@gmail.com',
        active:'1'
    };

    con.query("UPDATE customers SET email = ?, name = ?, active = ? WHERE id = ?", [customer.email, customer.name, customer.active, id], (err, output) => {
        let data;
        if (err) data = err;
        if (output.affectedRows) data = `updated ${output.affectedRows} customers`;
        res.json(data);
    });

});


// -------------------------------------------------------------------
// -------------------------------------------------------------------
// -------------------------------------------------------------------
// -------------------------------------------------------------------
// Simple Read File connection ---------------------------------------
const fs = require('fs');

// Fetch Record from File
app.get("/sraban_json", (req, res) => {

    // fs.readFile('data.json', (e, data) => {
    //     if (e) throw e;
    //     res.send(data);
    // });

    fs.readFile('data.json', 'utf8', function(err, data) {
      if (err) throw err;
      res.setHeader('Content-Type', 'application/json');
      res.send(data);
    });

});


// Uploading Files

app.post('/sraban_upload', function(req, res) {

    try {
        //throw new Error("-------------------");
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let avatar = req.files.avatar;
            
            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            avatar.mv('./upload/' + avatar.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: avatar.name,
                    url: base_url+'/'+avatar.name,
                    mimetype: avatar.mimetype,
                    size: avatar.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }

});

app.post('/sraban_multi_upload', function(req, res) {
    try {
        if(!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let data = []; 
    
            //loop all files
            _.forEach(_.keysIn(req.files.photos), (key) => {
                let photo = req.files.photos[key];
                
                //move photo to uploads directory
                photo.mv('./upload/' + photo.name);

                //push file details
                data.push({
                    name: photo.name,
                    url: base_url+'/'+photo.name,
                    mimetype: photo.mimetype,
                    size: photo.size
                });
            });
    
            //return response
            res.send({
                status: true,
                message: 'Files are uploaded',
                data: data
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});



// set port, listen for requests
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});