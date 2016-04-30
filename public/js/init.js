carmResults = 0;
dewickResults = 0;
var x = 0;

// note: there is currently an issue where the comparison doesnt work if one of the halls does not have a meal under that day.

window.addEventListener('load', function() {
    
    $.ajax({
        url: '/getmealdata',
        dataType: 'json',
        data: {
            meal: 'Dinner',
            day: 27,
            month: 4,
            year: 2016
        },
        success: function(result) {
            carmResults = result.carm.score;
            dewickResults = result.dewick.score;
            loadBar();
            console.log("lol");
            console.log(result);
            // sort in order of most significant
            result.carm.food_arr.sort(sortFoods);
            result.dewick.food_arr.sort(sortFoods);

            result.carm.food_arr.forEach(function(item, index) {
                $('#leftfoods').append(function() {
                    return createItem(item, 'left');
                });
            });
            // sort in order of most significant
            result.dewick.food_arr.forEach(function(item, index) {
                $('#rightfoods').append(function() {
                    return createItem(item, 'right');
                });
            });
        }
    });
});

function sortFoods(a, b) {
    return ((b.up - b.down) * b.weight) - ((a.up - a.down) * a.weight);
}

function createItem(item, position) {
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
                    item.up++;
                    $(this).parent().find('.food-score').html(item.up - item.down);

                    console.log(item._id);
                    console.log(item.name);

                    $.ajax({
                        method: 'POST',
                        url: '/upvote',
                        data: {
                            food: item.name,
                            compID: item._id // WHAT GOES HERE???
                        }
                    }).done(function(result) {
                        console.log('WOO!');
                        console.log(result);
                    });
                    
                    //     success: function(result) {
                    //         console.log("WOO");
                    //     }
                    // });



                }).append(function() {
                    return $('<span>').attr({
                        class: 'glyphicon glyphicon-menu-up'
                    });
                });
            }).append(function() {
                return $('<button>').attr({
                    class: 'btn btn-danger'
                }).click( function() {
                    item.down++;
                    $(this).parent().find('.food-score').html(item.up - item.down);

                    /*
                    $.ajax({
                        method: 'POST',
                        url: '/upvote',
                        data: {
                            food: item.name,
                            compID: item._id // WHAT GOES HERE?
                        }
                    }).done(function(result) {
                        console.log('WOO!');
                        console.log(result);
                    });
                    */


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

// React.js: call this.setState() in react. check also: componentDidMount
