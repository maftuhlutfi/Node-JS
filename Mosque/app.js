const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/", function (req, res) {
	var date = new Date();
	results.forEach(function (result) {
		var date1 = result.date.substring(0,2);
		var month = result.date.substring(3,5);
		var year = result.date.substring(6);
		if (date1 == date.getDate() && month == date.getMonth() + 1 && year == date.getFullYear()) {
			res.render("index", {
				fajar: "0" + result.fajar,
				zohar: result.zohar,
				asr: result.asr,
				maghrib: result.maghrib,
				esha: result.esha,
				jummah: result.jummah
			})
		}
	})
})

app.listen(3000, function () {
	console.log("Server started at port 3000");
	
	
}) 
var z = 10;

const csv = require('csv-parser')
const fs = require('fs')
const results = [];
 


fs.createReadStream('praydata/praydata.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data));
