//mod.js

function load() {

	console.log("WHENISIT?");
	console.log(result.carm.score);
	console.log(dewick.carm.score);

	carm = document.getElementById("carm");
	dewick = document.getElementById("dewick");

	numbers();

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

