var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var assert = require('assert');
var url = 'mongodb://localhost:27017/test';

var Emergency = (function()
{
	//Private Default Object
	var EmergencyObject = {};
	return {
		newEmergency: function(latitude,longitude,telefone,stats)
		{
			
			EmergencyObject =	
				{
					//_id: new ObjectID(),
					latitude: latitude,
					longitude: longitude,
					telefone: telefone,
					stats:stats,
					date:new Date()
				}
		},

		insertEmergency : function(){
			function insert(db, callback) {
				   db.collection('emergency').insertOne( EmergencyObject, 
				   	function(err, result) {
					    assert.equal(err, null);
					    console.log("Inserted a document into the emergency collection.");
					    //console.log(result.ops);
					    callback();
				  });
				}

				MongoClient.connect(url, function(err, db) {
				  assert.equal(null, err);
				  insert(db, function() {
				      db.close();
				  });
			});
		},

		getAllEmergency : function(asyncallback){
			var findRestaurants = function(db, callback) {
				var today = new Date();
				today.setHours(0);
				today.setMinutes(0);
				today.setMilliseconds(0);
			    db.collection('emergency').find({
			    	date:{$gte: today}
			    }).toArray(function(err, documents) {
			        assert.equal(null, err);
			        //console.log(cursor);
			        cursor = documents;
			        callback();
			      });
			};

			MongoClient.connect(url, function(err, db) {
			  assert.equal(null, err);
			  findRestaurants(db, function() {
			    db.close();
			    asyncallback(cursor);	
			  });
			})

		},
		getEmergencyByID: function(id , asyncallback)
		{
			var findEmergency = function(db, callback) {
			    db.collection('emergency').findOne({"_id":new ObjectID(id)}, function(err, doc){
			    	callback(doc);
			    });
			};

			MongoClient.connect(url, function(err, db) {
			  assert.equal(null, err);
			  findEmergency(db, function(doc) {
			    db.close();
			    asyncallback(doc);	
			  });
			});

		},
		SetCarByID: function( emergencyID, carID ,asyncallback)
		{
			var setcar = function(db,callback)
			{	
				db.collection('emergency').updateOne({"_id":new ObjectID(emergencyID)}
					,{$set:{stats:"InProcess", ambulance:carID}},function(err,result)
					{
						assert.equal(null, err);
					    assert.equal(1, result.matchedCount);
					    //assert.equal(1, result.modifiedCount);
						callback(true);
					});
			}
			MongoClient.connect(url, function(err, db) {
			  assert.equal(null, err);
			  setcar(db, function(bool) {
			    db.close();
			    asyncallback(bool);	
			  });
			});
      

		},

		finishEmergencyByID: function( emergencyID,asyncallback)
		{
			var finishEmergency = function(db,callback)
			{
				db.collection('emergency').updateOne({"_id":new ObjectID(emergencyID)}
					,{$set:{stats:"Finish"}},function(err,result)
					{
						assert.equal(null, err);
					    assert.equal(1, result.matchedCount);
					    //assert.equal(1, result.modifiedCount);
						callback(true);
					});
			}
			MongoClient.connect(url, function(err, db) {
			  assert.equal(null, err);
			  finishEmergency(db, function(bool) {
			    db.close();
			    asyncallback(bool);	
			  });
			});
      

		},
		getEmergencyByAmbulance: function( ambulanceID,asyncallback)
		{
			console.log("entra al metodo");
			var today = new Date();
			today.setHours(0);
			today.setMinutes(0);
			today.setMilliseconds(0);
			var findEmergency = function(db, callback) {
			    db.collection('emergency').find({"ambulance":ambulanceID,
			     	stats:"InProcess",
			     	date:{$gte: today}
			     }).toArray(function(err, doc){
			    	callback(doc);
			    });
			};
			
			MongoClient.connect(url, function(err, db) {
			  assert.equal(null, err);
			  findEmergency(db, function(doc) {
			    db.close();
			    asyncallback(doc);	
			  });
			});
      //new Date()

		}
	}
	}
)();



module.exports = Emergency;