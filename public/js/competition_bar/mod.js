//mod.js

function loadBar() {

	console.log("WHENISIT?");
	console.log(carmResults);
	console.log(dewickResults);

	carm = document.getElementById("carm");
	dewick = document.getElementById("dewick");

	numbers();

}

function numbers() {

	totalResults = carmResults+dewickResults;
	
	carmPerc = carmResults/totalResults * 100;
	carmPerc = keepAboveFifteen(carmPerc);
	carm.attributes.style.nodeValue = "width:"+carmPerc+"%";

	dewPerc = 100-carmPerc;
	dewPerc = keepAboveFifteen(dewPerc);
	dewick.attributes.style.nodeValue = "width:"+dewPerc+"%";
}

