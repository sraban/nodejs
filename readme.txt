#Steps:
npm init
enppoint server.js
node server.js
for set up/
		app/controllers, models, routes, config
https://bezkoder.com/node-js-rest-api-express-mysql/
---------------------------------------
Err: 'Client does not support authentication protocol requested by server; consider upgrading MySQL client'
Sol: 
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
flush privileges;

---------------------------------------------
Test:

GET
http://localhost:3000/
http://localhost:3000/sraban


GET
http://localhost:3000/customers
http://localhost:3000/customers/1


DELETE
http://localhost:3000/customers
http://localhost:3000/customers/1

POST/PUT
http://localhost:3000/customers - POST
http://localhost:3000/customers/1 - PUT