window.addEventListener('load', function() {
    $.ajax({
        url: '/getmealdata',
        data: {
            meal: "Breakfast",
            day: 28,
            month: 3,
            year: 2016
        },
        success: function(result) {
                console.log(result);
                // sort in order of most significant
                // result.carm.forEach(function(item, index) {
                //     $("#leftfoods").append(function() {
                //         return $("<div>").append(function() {
                //             return $("<img>").attr({
                //                 alt: item.name,
                //                 src: item.imgurl,
                //                 class: 'left-food-thumbnail'
                //             });
                //         }).append(function() {
                //             return $("<span>").html(item.name);
                //         });
                //     });
                // });
                // // sort in order of most significant
                // result.dewick.forEach(function(item, index) {
                //     $("#rightfoods").append(function() {
                //         return $("<div>").html(item.name).append(function() {
                //             return $("<img>").attr({
                //                 alt: item.name,
                //                 src: item.imgurl,
                //                 class: 'right-food-thumbnail'
                //             });
                //         });
                //     });
                // });
                // $("body").html(JSON.stringify(result));
            }
            // dataType: 'dataTypeext/html'
    });
});
