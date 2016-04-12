carmResults = 0;
dewickResults = 0;



window.addEventListener('load', function() {

    $.ajax({
        url: '/getmealdata',
        data: {
            meal: "Dinner",
            day: 28,
            month: 3,
            year: 2016
        },
        success: function(result) {

                // INTERMEDIATE STEP: 
                // will be real scores eventually
                // result.carm.score = 400;
                // result.dewick.score = 625;
                //
                //
                //

                carmResults = result.carm.score;
                dewickResults = result.dewick.score;

                loadBar();

                console.log(result);
                // sort in order of most significant
                result.carm.food_arr.sort(sortFoods);
                result.dewick.food_arr.sort(sortFoods);

                result.carm.food_arr.forEach(function(item, index) {
                    $("#leftfoods").append(function() {
                        return $("<div>").append(function() {
                            return $("<img>").attr({
                                alt: item.name,
                                src: item.imgurl,
                                class: 'left-food-thumbnail'
                            });
                        }).append(function() {
                            return $("<span>").append(function() {
                                return $("<div>").html(item.name).attr({
                                    class: 'food-title'
                                });
                            }).append(function() { // add carm upvote
                                var carmUPvoteDIV = $("<div id=upvote>").html("<button type='button' class='btn btn-success upButton'>√ " + item.up + "</button>");
                                carmUPvoteDIV.click(function(){
                                    item.up++;
                                    // item in database = item.up
                                    carmUPvoteDIV.html("<button type='button' class='btn btn-success upButton'>√ " + item.up + "</button>");
                                });
                                return carmUPvoteDIV;
                            }).append(function() { // add carm downvote
                                var carmDOWNvoteDIV = $("<div id=downvote>").html("<button type='button' class='btn btn-danger downButton'>X " + item.down+"</button>");
                                carmDOWNvoteDIV.click(function(){
                                    item.down++;
                                    // item in database = item.down
                                    carmDOWNvoteDIV.html("<button type='button' class='btn btn-danger downButton'>X "+ item.down+"</button>");
                                });
                                return carmDOWNvoteDIV;
                            }).attr({
                                class: 'food-desc'
                            });
                        });
                    }).attr({
                        class: 'food-unit'
                    });
                });
                // sort in order of most significant
                result.dewick.food_arr.forEach(function(item, index) {
                    $("#rightfoods").append(function() {
                        return $("<div>").append(function() {
                            return $("<img>").attr({
                                    alt: item.name,
                                    src: item.imgurl,
                                    class: 'right-food-thumbnail'
                                });
                            }).prepend(function() {
                                return $("<span>").append(function() {
                                    return $("<div>").html(item.name).attr({
                                        class: 'food-title'
                                    });
                                }).append(function() { // add dewick up vote
                                    var dewickUPvoteDIV = $("<div id=upvote>").html("<button type='button' class='btn btn-success upButton'>√ " + item.up + "</button>");
                                    dewickUPvoteDIV.click(function(){
                                        item.up++;
                                        // item in database = item.up
                                        dewickUPvoteDIV.html("<button type='button' class='btn btn-success upButton'>√ " + item.up + "</button>");
                                    });
                                    return dewickUPvoteDIV;
                                }).append(function() { // add dewick down vote
                                    var dewickDOWNvoteDIV = $("<div id=downvote>").html("<button type='button' class='btn btn-danger downButton'>X " + item.down+"</button>");
                                    dewickDOWNvoteDIV.click(function(){
                                        item.down++;
                                        // item in database = item.down
                                        dewickDOWNvoteDIV.html("<button type='button' class='btn btn-danger downButton'>X " + item.down+"</button>");
                                    });
                                    return dewickDOWNvoteDIV;
                                }).attr({
                                    class: 'food-desc'
                                });
                            });
                        }).attr({
                            class: 'food-unit'
                        });
                });
            }
    });
});

function sortFoods(a, b) {
    return ((b.up - b.down) * b.weight) - ((a.up - a.down) * a.weight);        
}

// React.js: call this.setState() in react. check also: componentDidMount