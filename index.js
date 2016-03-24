var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var request = require('request');
var async = require('async');
var app = express();

var mongoUri = process.env.MONGOLAB_URI || "mongodb://localhost:27017/dining";
var MongoClient = require('mongodb').MongoClient;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
    db = databaseConnection;
});

var weights = {
    'CARVED MEATS & POULTRY': 30,
    'Hearty Soups': 25,
    'VEGETARIAN': 30,
    'VEGETABLES': 5,
    'BREADS & ROLLS': 10,
    'DINNER ENTREES': 50,
    'PASTA & SAUCES': 30,
    'SAUCES, GRAVIES & TOPPINGS': 20,
    'PIZZA': 25,
    'GRILL SELECTIONS': 40,
    'POTATO & RICE ACCOMPANIMENTS': 35,
    'BAKED FRESH DESSERTS': 40,
    'CREATE YOUR OWN STIRFRY': 5
};

var tddAPI = 'https://tuftsdiningdata.herokuapp.com/menus/';

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/getmealdata', function(req, res) {
    var day = req.query.day;
    var month = req.query.month;
    var year = req.query.year;
    var meal = req.query.meal;
    var compKey = meal + '-' + day + '-' + month + '-' + year;
    var query = {};
    query[compKey] = { $exists: true };
    db.collection('comparisons').findOne(query, function(err, result) {
        if (!result) {
            var carmMenu, dewMenu, comparison;
            var apiarg = '/' + day + '/' + month + '/' + year;
            request(tddAPI + 'carm' + apiarg, function(error, response, body) {
                if (error) {
                    res.send(500);
                }
                carmMenu = JSON.parse(body);
                // instead of hard coding the 'dewick', we could make it more dynamic by allowing user to specify args (requires change to comparisons structure)
                request(tddAPI + 'dewick' + apiarg, function(error, response, body) {
                    if (error) {
                        res.send(500);
                    }
                    dewMenu = JSON.parse(body);
                    initComp(carmMenu.data[meal], dewMenu.data[meal], function(comparison) {
                        var retVal = {};
                        retVal[compKey] = comparison;
                        res.json(retVal);
                        res.end();
                        db.collection('comparisons').insert(retVal, function() {});
                    });
                    // since we already retrieved the menu data, we add the other meals too
                    for (var othermeal in carmMenu.data) {
                        if (othermeal != meal) {
                            initComp(carmMenu.data[othermeal], dewMenu.data[othermeal], addComp(othermeal, req.query));
                        }
                    }
                });
            });
        } else {
            console.log('already exists');
            res.json(result);
            res.end();
        }
    });

});

function addComp(othermeal, query) {
    return function(comparison) {
        var retVal = {};
        retVal[othermeal + '-' + query.day + '-' + query.month + '-' + query.year] = comparison;
        db.collection('comparisons').insert(retVal, function() {});
    };
}

function initComp(carmMenu, dewMenu, callback) {
    var comp = {};
    getFoodsAndScore(carmMenu, function(foodArr) {
        comp.carm = foodArr;
        getFoodsAndScore(dewMenu, function(foodArr) {
            comp.dewick = foodArr;
            callback(comp);
        });
    });
}

function getFoodsAndScore(menu, callback) {
    var foodArr = [];
    var score = 0; // TODO: USE THIS
    async.forEachOf(menu, function(typearr, type, callback1) {
        type = type.trim();
        async.each(typearr, function(foodname, callback2) {
            checkForFood(type, foodname, function(food) {
                foodArr.push(food);
                callback2();
            });
        }, function(err) {        
            callback1();
        });
    }, function(err) {
        callback(foodArr);
    });
}

function checkForFood(foodType, key, callback) {
    var query = {};
    key = key.replace(/[\."$]/g, "");
    query[key] = { $exists: true };
    db.collection('foods').findOne(query, function(err, result) {
        if (!result) {
            query[key] = {
                imgurl: '',
                type: foodType,
                weight: weights[foodType], //delete this?
                ups: 0,
                downs: 0
            };
            callback(query);
            db.collection('foods').insert(query, function() {});
        } else {
            callback(result);
        }
    });
}

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});


