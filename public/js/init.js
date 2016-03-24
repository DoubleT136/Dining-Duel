window.addEventListener('load', function() {
    $.ajax({
        url: '/getmealdata',
        data: {
            meal: "Lunch",
            day: 31,
            month: 3,
            year: 2016
        },
        success: function(result) {
            console.log(result);
            $("body").html(JSON.stringify(result));
        }
        // dataType: 'dataTypeext/html'
    });
});