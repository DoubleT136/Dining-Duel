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
                            }).append(function() {
                                return $("<div>").html(' Ups: ' + item.up);
                            }).append(function() {
                                return $("<div>").html(' Downs: ' + item.down);
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
                                }).append(function() {
                                    return $("<div>").html(' Ups: ' + item.up);
                                }).append(function() {
                                    return $("<div>").html(' Downs: ' + item.down);
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