//mod.js

function load() {

	carm = document.getElementById("carm");
	dewick = document.getElementById("dewick");

	numbers();

	//console.log(width);
	//console.log(width.attributes.style.nodeValue);
	//console.log(width.clientHeight);

	//carm.attributes.style.nodeValue = "width:50%"
	//dewick.attributes.style.nodeValue = "width:50%"

	// console.log(width.attributes.style.nodeValue);
	// console.log(width.clientHeight);
	// console.log(width.style.height);

}

function numbers() {

	carmPerc = getRandom(0,100);
	carmPerc = keepAboveTwentyFive(carmPerc);
	carm.attributes.style.nodeValue = "width:"+carmPerc+"%";

	dewPerc = 100-carmPerc;
	dewick.attributes.style.nodeValue = "width:"+dewPerc+"%";

	console.log("carmPerc: "+carmPerc+ " | dewPerc: "+dewPerc);
	console.log(carm.attributes.style.nodeValue + " " +dewick.attributes.style.nodeValue);
}


/*
function stateChange(newState) {
    setTimeout(function () {
        if (newState == -1) {
            //alert('VIDEO HAS STOPPED');
        }
    }, 5000);
}
*/