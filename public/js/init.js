carmResults = 0;
dewickResults = 0;

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
    return (b.up * b.weight) - (a.up * a.weight);
}

function createItem(item, position, compID) {
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
                return $('<div>').html(item.up).attr({
                    class: 'food-score',
                });
            }).append(function() {
                return $('<button>').attr({
                    class: 'btn btn-success'
                }).click(function() {
                    var displayScore = $(this).parent().find('.food-score');
                    $.ajax({
                        method: 'POST',
                        url: '/vote',
                        data: {
                            food: item.name,
                            compID: compID,
                            type: 'u'
                        },
                        success: function(result) {
                            if ($.isEmptyObject(result)) {
                                return;
                            }
                            carmResults = result.compdata.carm.score;
                            dewickResults = result.compdata.dewick.score;
                            loadBar();
                            setScore(position, result, item, displayScore);
                        }
                    });
                }).append(function() {
                    return $('<span>').attr({
                        class: 'glyphicon glyphicon-menu-up'
                    });
                });
            }).append(function() {
                return $('<button>').attr({
                    class: 'btn btn-danger'
                }).click(function() {
                    var displayScore = $(this).parent().find('.food-score');
                    $.ajax({
                        method: 'POST',
                        url: '/vote',
                        data: {
                            food: item.name,
                            compID: compID,
                            type: 'd'
                        },
                        success: function(result) {
                            if ($.isEmptyObject(result)) {
                                return;
                            }
                            carmResults = result.compdata.carm.score;
                            dewickResults = result.compdata.dewick.score;
                            loadBar();
                            setScore(position, result, item, displayScore);
                        }
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
    });
}

// changes the displayed score of an item on the page
function setScore(position, result, item, displayScore) {

    if (position === 'left') { // carm
        // updates score on clicked button's block
        for (var x in result.compdata.carm.food_arr) {
            if (result.compdata.carm.food_arr[x].name === item.name) {
                var carm_food_item = result.compdata.carm.food_arr[x];
                displayScore.html(carm_food_item.up);
            }
        }

        // updates score on identical item in other dining hall
        var carmtempStore = $(rightfoods).find('.food-block');
        carmtempStore.each(function() {
            if ($(this).find('.food-title')[0].innerHTML === item.name) {
                var newScore = $(this).find('.food-score');
                newScore.html(carm_food_item.up);
            }
        });

    } else if (position === 'right') { // dewick
        // updates score on clicked button's block
        for (var y in result.compdata.dewick.food_arr) {
            if (result.compdata.dewick.food_arr[y].name === item.name) {
                var dew_food_item = result.compdata.dewick.food_arr[y];
                displayScore.html(dew_food_item.up);
            }
        }

        // updates score on identical item in other dining hall
        var dewtempStore = $(leftfoods).find('.food-block');
        dewtempStore.each(function() {
            if ($(this).find('.food-title')[0].innerHTML === item.name) {
                var newScore = $(this).find('.food-score');
                newScore.html(dew_food_item.up);
            }
        });
    }
}
