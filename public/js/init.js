carmResults = 0;
dewickResults = 0;
var x = 0;

// note: there is currently an issue where the comparison doesnt work if one of the halls does not have a meal under that day.

window.addEventListener('load', function() {
    
    $.ajax({
        url: '/getmealdata',
        dataType: 'json',
        data: {
            meal: 'Lunch',
            day: 30,
            month: 4,
            year: 2016
        },
        success: function(result) {
            carmResults = result.compdata.carm.score;
            dewickResults = result.compdata.dewick.score;
            loadBar();
            console.log(result);
            // sort in order of most significant
            result.compdata.carm.food_arr.sort(sortFoods);
            result.compdata.dewick.food_arr.sort(sortFoods);

            result.compdata.carm.food_arr.forEach(function(item, index) {
                $('#leftfoods').append(function() {
                    return createItem(item, 'left', result.compID);
                });
            });
            // sort in order of most significant
            result.compdata.dewick.food_arr.forEach(function(item, index) {
                $('#rightfoods').append(function() {
                    return createItem(item, 'right', result.compID);
                });
            });
        }
    });
});

function sortFoods(a, b) {
    return ((b.up - b.down) * b.weight) - ((a.up - a.down) * a.weight);
}

function createItem(item, position, compID) {
    console.log("new");
    var opp = 'right';
    if (position === 'right') {
        opp = 'left';
    }
    return $('<div>').append(function() {
        return $('<div>').attr({
            class: 'desc'
        }).append(function() {
            return $('<span>').html(item.name).attr({
                class: 'food-title ' + position + '-align ' + position + '-block',
            });
        }).append(function() {
            return $('<div>').append(function() {
                return $('<div>').html(item.up - item.down).attr({
                    class: 'food-score',
                });
            }).append(function() {
                return $('<button>').attr({
                    class: 'btn btn-success'
                }).click( function() {
                    var displayScore = $(this).parent().find('.food-score');
                    $.ajax({
                        method: 'POST',
                        url: '/upvote',
                        data: {
                            food: item.name,
                            compID: compID
                        }
                    }).done(function(result) {
                        setScore(position,result,item,displayScore);
                    });
                }).append(function() {
                    return $('<span>').attr({
                        class: 'glyphicon glyphicon-menu-up'
                    });
                });
            }).append(function() {
                return $('<button>').attr({
                    class: 'btn btn-danger'
                }).click( function() {
                    var displayScore = $(this).parent().find('.food-score');
                    $.ajax({
                        method: 'POST',
                        url: '/downvote',
                        data: {
                            food: item.name,
                            compID: compID
                        }
                    }).done(function(result) {
                        setScore(position,result,item,displayScore);
                    });
                }).append(function() {
                    return $('<span>').attr({
                        class: 'glyphicon glyphicon-menu-down'
                    });
                });
            }).attr({
                class: 'voting-' + position + ' pull-' + opp
            });
        });
    }).attr({
        class: 'food-block',
        style: 'background-image: url(' + item.imgurl + ');'
    }).append({

    });
    // .css('background-image',
    //     'url(' + item.imgurl + ')').html(item.name).attr({
    //     // class: 'img-thumbnail food-item'
    // });
    /*.append(function() {
        return $('<div>').append(function() {
            return $('<div>').html(item.name).attr({
                class: 'food-title'
            });
        }).append(function() {
            return $('<button>').attr({
                class: 'btn btn-success'
            });
        }).append(function() {
            return $('<button>').attr({
                class: 'btn btn-failure'
            });
        }).attr({
            class: 'food-desc'
        });
    }).attr({
        class: 'food-block'
    });*/


    // }).append(function() {
    //     return $('<span>').append(function() {
    //         return $('<div>').html(item.name).attr({
    //             class: 'food-title'
    //         }).append(function() { // add carm upvote
    //             var carmUPvoteDIV = $('<div id=upvote>').html('<button type='button' class='btn btn-success upButton'>√ ' + item.up + '</button>');
                // carmUPvoteDIV.click(function() {
                //     item.up++;
                //     // item in database = item.up
                //     carmUPvoteDIV.html('<button type='but ton' class='btn btn-success upButton'>√ ' + item.up + '</button>');
                // });
    //             return carmUPvoteDIV;
    //         }).append(function() { // add carm downvote
    //             var carmDOWNvoteDIV = $('<div id=downvote>').html('<button type='button' class='btn btn-danger downButton'>X ' + item.down + '</button>');
    //             carmDOWNvoteDIV.click(function() {
    //                 item.down++;
    //                 // item in database = item.down
    //                 carmDOWNvoteDIV.html('<button type='button' class='btn btn-danger downButton'>X ' + item.down + '</button>');
    //             });
    //             return carmDOWNvoteDIV;
    //         });
    //     });
    // });

}

// changes the displayed score of an item on the page
function setScore(position,result,item,displayScore) {

    if (position === 'left'){ // carm

        // updates score on clicked button's block
        for (x in result.compdata.carm.food_arr) {
            if (result.compdata.carm.food_arr[x].name === item.name) {
                var carm_food_item = result.compdata.carm.food_arr[x];
                displayScore.html(carm_food_item.up-carm_food_item.down);
            }
        }

        // updates score on identical item in other dining hall (WHY???)
        var tempStore = $(rightfoods).find('.food-block');
        tempStore.each(function() {
            if($(this).find('.food-title')[0].innerHTML === item.name) {
                var newScore = $(this).find('.food-score');
                newScore.html(carm_food_item.up-carm_food_item.down);
            }
        });

    } else if (position === 'right') { // dewick

        // updates score on clicked button's block
        for (y in result.compdata.dewick.food_arr) {
            if (result.compdata.dewick.food_arr[y].name === item.name) {
                var dew_food_item = result.compdata.dewick.food_arr[y];
                displayScore.html(dew_food_item.up-dew_food_item.down);
            }
        }

        // updates score on identical item in other dining hall
        var tempStore = $(leftfoods).find('.food-block');
        tempStore.each(function() {
            if($(this).find('.food-title')[0].innerHTML === item.name) {
                var newScore = $(this).find('.food-score');
                newScore.html(dew_food_item.up-dew_food_item.down);
            }
        });
    }





/*
    // carm
    if (position === 'left') {
        for (x in result.compdata.carm.food_arr) {
            if (result.compdata.carm.food_arr[x].name === item.name) {
                var carm_food_item = result.compdata.carm.food_arr[x];
                displayScore.html(carm_food_item.up-carm_food_item.down);
            }
        }
    } 

    // dewick
    else {
        for (y in result.compdata.dewick.food_arr) {
            if (result.compdata.dewick.food_arr[y].name === item.name) {
                var dew_food_item = result.compdata.dewick.food_arr[y];
                displayScore.html(dew_food_item.up-dew_food_item.down);
            }
        }
    }
*/
}

// React.js: call this.setState() in react. check also: componentDidMount
