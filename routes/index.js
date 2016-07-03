var express = require('express');
var router = express.Router();
var emergency = require('../models/Emergency');

/* GET home page. */
router.get('/', function(req, res) {
	emergency.getAllEmergency(function(cursor) {
		//res.sendfile("views/index2.html");

		res.render('home');
		//res.render('index', { title : JSON.stringify(cursor)  } );
	  });
  
  //res.render('index',{title:"Expresseate"});
});

module.exports = router
