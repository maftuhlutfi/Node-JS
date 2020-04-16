const request = require('request');
const cheerio = require('cheerio');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const express = require("express");
const ejs = require("ejs");

// app.use
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/coronaTmg", {useNewUrlParser: true,  useUnifiedTopology: true});

// Create schema and collection
const dataCoronaSchema = new mongoose.Schema({
    "tanggal" : String,
    "odp" : Number,
    "pdp" : Number,
    "positif" : Number,
    "sembuh" : Number,
    "meninggal" : Number
})

const dataCorona = mongoose.model("dataCorona", dataCoronaSchema);


// Function scrap dari web
function getData() {
	request('http://corona.temanggungkab.go.id/', function (error, response, body) {
		
		if (!error) {
			var tanggal = "";
			var jumlah = [];
			const $ = cheerio.load(body);
			
			// Cari tanggal
			tanggal = $("span p").text();
			tanggal = tanggal.substring(21, tanggal.indexOf('(')).trim();

			// Cari jumlah
			$("div.feature-block-four").each(function (i , elem) {
				jumlah.push(parseInt($(this).children("h1").text()));
			})
			
			// Log ke console
			console.log(tanggal);
			jumlah.forEach(function (i) {
				console.log(i);
			})

			// Cek apakah data sudah ada
			dataCorona.findOne().sort({_id: -1}).exec(function (err, data) {
			  	if (!err) {
			  		// Jika belum ada
			  		if (tanggal !== data.tanggal) {
			  			var data = new dataCorona({
							"tanggal" : tanggal,
						    "odp" : jumlah[0],
						    "pdp" : jumlah[1],
						    "positif" : jumlah[2],
						    "sembuh" : jumlah[3],
						    "meninggal" : jumlah[4]
						});
						data.save(function (err) {
							if (!err) {
								console.log("success");
							}
						})
				  	}
			  	}
			  		
			  });
		}
	});
}

// get
app.get("/", function (req, res) {
	// Panggil method scrapper
	getData();

	// Cari data hari ini
	var dataToday = {};
	dataCorona.findOne().sort({_id: -1}).exec(function (err, data){
		if (!err) {
			dataToday = data;

		}
	})

	// Cari data kemarin
	var dataKemarin = {};
	var selisihJumlah = [];
	dataCorona.find().sort({_id: -1}).limit(2).exec(function (err, data){
		if (!err) {
			data.forEach(function (i, index) {
				if (index === 1) {
					dataKemarin = i;
				}
				// Cari selisih data today dan kemarin
				selisihJumlah[0] = dataToday.odp - dataKemarin.odp;
				selisihJumlah[1] = dataToday.pdp - dataKemarin.pdp;
				selisihJumlah[2] = dataToday.positif - dataKemarin.positif;
				selisihJumlah[3] = dataToday.sembuh - dataKemarin.sembuh;
				selisihJumlah[4] = dataToday.meninggal - dataKemarin.meninggal;
			
				// Format untuk - 0 dan +
				selisihJumlah.forEach(function (selisih, index) {
					if (selisih > 0) {
						selisihJumlah[index] = "+" + selisih;
					}
					else if (selisih === 0) {
						selisihJumlah[index] = "";
					}
				})
			})
			
			// Sudah ketemu render ke ejs
			res.render("index", {
				data: dataToday,
				selisih: selisihJumlah
			});
		}
	})
	
	
	
})

// listen
app.listen(3000, function() {
  console.log("Server started on port 3000");
});