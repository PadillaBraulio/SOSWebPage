
var express = require('express');
var router = express.Router();
var qs = require('querystring');
var emergency = require('../models/Emergency');



var changeData = (function()
{
	var newdata = 0;
	return { 
		actualData: function(){
			return newdata;
		},
		change: function(){
			newdata++
			console.log(newdata + "  numero en funcion");
		}
	}

})();


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/PutEmergency*', function(req, res) {
	var str = req.url.split('?')[1];
  	var array = qs.parse(str);
  	console.log('longitud del arreglo');
  	console.log(Object.keys(array).length);

  	console.log('longitud del arreglo');
	if (Object.keys(array).length == 3){
		var latitude = array['latitude'];
		var longitude = array['longitude'];
		var telefone = array['telefone'];
		var stats = "Waiting";
		emergency.newEmergency(latitude,longitude,telefone,stats);
		emergency.insertEmergency();
		changeData.change();
		var val = 0;
		res.send("{result: \'emergency putted satisfactory \'}");
	}
	else{
   		res.send('{error:\'this function need three parameters\' }');
	};

   console.log(req.url);
});

router.get('/getAllEmergency',function(req,res){
	emergency.getAllEmergency(function(cursor) {
	    res.send("{ result : " + JSON.stringify(cursor) + "}");	
	  });
	
});
router.get('/getEmergencyByID',function(req,res){
	var str = req.url.split('?')[1];
  	var array = qs.parse(str);
  	if (Object.keys(array).length == 1){
  		var id = array["emergencyid"];
		emergency.getEmergencyByID(id,function(doc)
		{
			res.send("{ result : " + JSON.stringify(doc) + "}");
		});
	}
	else{

	}
});

router.get('/setCarByID',function(req,res){
	var str = req.url.split('?')[1];
  	var array = qs.parse(str);
  	if (Object.keys(array).length == 2){
  		var id = array["emergencyid"];
  		var carID = array["carid"];
		emergency.SetCarByID(id,carID,function(bool)
		{
			if(bool)
			{

				res.send("{ result : Updatte success }");
			}
			else
			{
				res.send("{ result : Updatte failed }");

			}
			
		});
	}
	else{
		res.send('{error:\'setcar function need one parameters\' }');
	}
});

router.get('/finishEmergencyByID',function(req,res){
	var str = req.url.split('?')[1];
  	var array = qs.parse(str);
  	if (Object.keys(array).length == 1){
  		var id = array["emergencyid"];
		emergency.finishEmergencyByID(id,function(bool)
		{
			if(bool)
			{

				res.send("{ result : Updatte success }");
			}
			else
			{
				res.send("{ result : Updatte failed }");

			}
			
		});
	}
	else{
		res.send('{error:\'finishEmergencyById function need one parameters\' }');
	}
});
function SocketFunction (socket) {

	var val = -1;
	var firstime = true;
	//var aux = setInterval(emitAllData,500);
	var socketActualData = changeData.actualData();
	console.log(socketActualData + " Data actual del socket inicio");
	var observer = setInterval(function(){
		//console.log(changeData.actualData() + " data del sistema ");

		if(socketActualData != changeData.actualData())
		{
			//console.log(socketActualData + " Data cambio" + changeData.actualData());
			
			if(val >= 1){
				val = 0;
				socketActualData =  socketActualData + 1;
				//console.log(socketActualData + " Data actual del socket");

			}
			else
			{
				emitAllData();
			}

		//console.log(socketActualData + " Data actual del socket");
		}
		else if(firstime)
		{
			//console.log("First time socket");
			emitAllData();
			firstime = !firstime;
		}
	},500);

	function emitAllData()
	{
		emergency.getAllEmergency(function(cursor)
			{	
				socket.emit('news', { data: JSON.stringify(cursor) , newdata : true});
				
			});
	}

	

	socket.on('success', function (data) {
		val++;
		//console.log("success " + val);
	});

  socket.on('setCar', function (data) {
  	var idEmergency = data.id;
  	var idAmbulance = data.carID;
  	emergency.SetCarByID(idEmergency,idAmbulance,function(bool)
  		{
  			val = 0;
   			changeData.change();			
  			//emitAllData()
  		});
  });
  socket.on('finishEmergency', function (data) {
    var idEmergency = data.id;
    emergency.finishEmergencyByID(idEmergency,function(bool){
    	val = 0;
		changeData.change();				
		//emitAllData()
    });
  });
};


module.exports = {
	router:router,
	method:SocketFunction}



//db.emergency.find({"_id":ObjectId("576d7cb8601cd60a13d9db4b")})
