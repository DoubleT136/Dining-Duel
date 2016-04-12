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
    'SAUCES,GRAVIES & TOPPINGS': 20,
    'PIZZA': 25,
    'GRILL SELECTIONS': 40,
    'POTATO & RICE ACCOMPANIMENTS': 35,
    'BAKED FRESH DESSERTS': 40,
    'CREATE YOUR OWN STIRFRY': 5,
    'CHEESE & BREAD BAR': 10,
    'VEGETARIAN OPTIONS': 30,
    'FRUIT & YOGURT': 15,
    'LUNCH ENTREE': 40,
    'MEXICAN BAR': 20,
    'AFTERNOON WOK': 25,
    'DELI & PANINI': 10,
    'MORNING BELGIUM WAFFLE BAR': 1,
    'HOT BREAKFAST CEREAL': 5,
    'BRK BREADS,PASTRY & TOPPINGS': 15,
    'BREAKFAST MEAT': 25,
    'BREAKFAST MEATS': 25,
    'BREAKFAST ENTREES': 30,
    'BREAKFAST ENTREE': 30,
    'NOODLERY & STIR FRY': 25,
    'HALAL ENTREES': 40,
    'CHAR-GRILL STATIONS': 30,
    'HOT BREAKFAST CEREAL BAR': 5,
    'FRESH BAKED DESSERTS': 15,
    'BREAKFAST POTATO': 30
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
    if (!day || !month || !year || !meal) {
        res.sendStatus(404);
        return;
    }
    var compKey = meal + '-' + day + '-' + month + '-' + year;
    var query = {};
    query.compID = compKey;
    db.collection('comparisons').findOne(query, function(err, result) {
        if (!result) {
            var carmMenu, dewMenu, comparison;
            var apiarg = '/' + day + '/' + month + '/' + year;
            request(tddAPI + 'carm' + apiarg, function(error, response, body) {
                if (error) {
                    res.sendStatus(500);
                    return;
                }
                carmMenu = JSON.parse(body);
                // instead of hard coding the 'dewick', we could make it more dynamic by allowing user to specify args (requires change to comparisons structure)
                request(tddAPI + 'dewick' + apiarg, function(error, response, body) {
                    if (error) {
                        res.sendStatus(500);
                        return;
                    }
                    dewMenu = JSON.parse(body);
                    initComp(carmMenu.data[meal], dewMenu.data[meal], function(comparison) {
                        var toAdd = {};
                        toAdd.compID = compKey;
                        toAdd.compdata = comparison;
                        res.json(comparison);
                        res.end();
                        db.collection('comparisons').insert(toAdd, function() {});
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
            res.json(result.compdata);
            res.end();
        }
    });

});

/* Think about this: return ONLY WHAT IS NECESSARY,
and then update everything else secondary */
app.post('/upvote', function(req, res) {
    var foodName = req.body.food;
    var compID = req.body.compID;
    // TODO: check if foodname is a valid foodname

    // go to comparisons, update votes
    db.collection('comparisons').update({
        "compdata.carm.food_arr": {
            $elemMatch: {
                name: foodName
            }
        }
    }, {
        $inc: {
            "compdata.carm.food_arr.$.up": 1 //,
                // "compdata.carm.score": carmScoreChange
        }

    }, {
        multi: true
    }, function(err1, count1, result1) {
        if (err1) {
            res.send(500);
            return;
        }

        if (count1 !== 0) {
            // update score (can we do it in the update function?)
            // pass the weight and vote too? for constant-time update
            updateCarmScore(compID);
        }

        db.collection('comparisons').update({
            "compdata.dewick.food_arr": {
                $elemMatch: {
                    name: foodName
                }
            }
        }, {
            $inc: {
                "compdata.dewick.food_arr.$.up": 1 //,
                    // "compdata.dewick.score": dewScoreChange
            },
        }, {
            multi: true
        }, function(err2, count2, result2) {
            if (err2) {
                res.send(500);
                return;
            }

            if (count2 !== 0) {
                // update score (can we do it in the update function?)
                // pass the weight and vote too? for constant-time update
                updateDewScore(compID);
            }

            db.collection('comparisons').findOne({ compID: compID }, function(err, result) {
                if (!result) {
                    res.send(500);
                } else {
                    res.send(result.compdata);
                }
            });
        });
    });

    // go to foods collection, and update that.
    db.collection('foods').update({
        name: foodName,
    }, {
        $inc: {
            ups: 1
        }
    });
});

app.post('/downvote', function(req, res) {
    var foodName = req.body.food;
    var compID = req.body.compID;
    // TODO: check if foodname is a valid foodname

    // go to comparisons, update votes
    db.collection('comparisons').update({
        "compdata.carm.food_arr": {
            $elemMatch: {
                name: foodName
            }
        }
    }, {
        $inc: {
            "compdata.carm.food_arr.$.down": 1 //,
                // "compdata.carm.score": carmScoreChange
        }

    }, {
        multi: true
    }, function(err1, count1, result1) {
        if (err1) {
            res.send(500);
            return;
        }

        if (count1 !== 0) {
            // update score (can we do it in the update function?)
            // pass the weight and vote too? for constant-time update
            updateCarmScore(compID);
        }

        db.collection('comparisons').update({
            "compdata.dewick.food_arr": {
                $elemMatch: {
                    name: foodName
                }
            }
        }, {
            $inc: {
                "compdata.dewick.food_arr.$.down": 1 //,
                    // "compdata.dewick.score": dewScoreChange
            },
        }, {
            multi: true
        }, function(err2, count2, result2) {
            if (err2) {
                res.send(500);
                return;
            }

            if (count2 !== 0) {
                // update score (can we do it in the update function?)
                // pass the weight and vote too? for constant-time update
                updateDewScore(compID);
            }

            db.collection('comparisons').findOne({ compID: compID }, function(err, result) {
                if (!result) {
                    res.send(500);
                } else {
                    res.send(result.compdata);
                }
            });
        });
    });

    // go to foods collection, and update that.
    db.collection('foods').update({
        name: foodName,
    }, {
        $inc: {
            downs: 1
        }
    });
});


function updateDewScore(compID) {
    var score = 0; // TODO: USE THIS
    var denom = 0;
    db.collection('comparisons').find({"compdata.dewick.food_arr": {}}).forEach(function(food){
        console.log("DERICK HELP");
        console.log(food);
    })
    /*async.forEachOf(foodarr, function(food, index, callback1) {
        console.log(food);
        async.each(typearr, function(foodname, callback2) {
            checkForFood(type, foodname, function(food) {
                score += (food.up * food.weight) / (food.up + food.down + 1);
                denom += food.weight;
                foodArr.push(food);
                callback2();
            });
        }, function(err) {
            callback1();
        });
    }, function(err) {
        callback(foodArr, score / denom);
    });
    db.collection('comparisons').update({
        compdata: hall // this isn't right... fix the query
    }, {
        score: score
    });*/
}

function updateCarmScore(compID) {
    var score = 0; // TODO: USE THIS
    var denom = 0;
    var upvotes
    db.collection('comparisons').find({compID:compID}).forEach(function(food){
        food.compdata.carm.food_arr.forEach(function(food){
            score += (food.up * food.weight) / (food.up + food.down + 1);
            denom += food.weight;
        });
    }), function(){
        console.log(score/denom);
        db.collection('comparisons').update({compID:compID},
            {$set:{"carm.score": score/denom}}
        );
    };

}

function addComp(othermeal, query) {
    return function(comparison) {
        var toAdd = {};
        toAdd.compID = othermeal + '-' + query.day + '-' + query.month + '-' + query.year;
        toAdd.compdata = comparison;
        db.collection('comparisons').insert(toAdd, function() {});
    };
}

function initComp(carmMenu, dewMenu, callback) {
    var comp = {};
    getFoodsAndScore(carmMenu, function(foodArr, score) {
        console.log(score);
        comp.carm = { "food_arr": foodArr, "score": score };
        getFoodsAndScore(dewMenu, function(foodArr, score) {
            console.log(score);
            comp.dewick = { "food_arr": foodArr, "score": score };
            callback(comp);
        });
    });
}

function getFoodsAndScore(menu, callback) {
    var foodArr = [];
    var score = 0; // TODO: USE THIS
    var denom = 0;
    async.forEachOf(menu, function(typearr, type, callback1) {
        type = type.trim();
        async.each(typearr, function(foodname, callback2) {
            checkForFood(type, foodname, function(food) {
                score += (food.up * food.weight) / (food.up + food.down + 1);
                denom += food.weight;
                foodArr.push(food);
                callback2();
            });
        }, function(err) {
            callback1();
        });
    }, function(err) {
        callback(foodArr, score / denom);
    });
}

function checkForFood(foodType, foodname, callback) {
    var query = {};
    foodname = foodname.replace(/[\."$]/g, "");
    query.name = foodname;
    db.collection('foods').findOne(query, function(err, result) {
        if (!result) {
            var toAdd = {
                name: foodname,
                imgurl: 'http://placehold.it/200/eeba93?text=No+Image+Found',
                type: foodType,
                weight: weights[foodType], //delete this?
                up: Math.floor((Math.random() + Math.random() + Math.random()) * 10),
                down: Math.floor((Math.random() + Math.random() + Math.random()) * 10)
            };
            callback(toAdd);
            db.collection('foods').insert(toAdd, function() {});
        } else {
            callback(result);
        }
    });
}

app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});
