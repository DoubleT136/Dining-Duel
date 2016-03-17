// closerdininghall.js

var dewick = {};
dewick.name = "Dewick-Macphie Dining Center";
dewick.latitude = 42.405412;
dewick.longitude = -71.121312;
dewick.distanceFrom = 0;

var carm = {};
carm.name = "Carmichael Hall";
carm.latitude = 42.409395;
carm.longitude = -71.122735;
carm.distanceFrom = 0;

getLocation();

// get user location
function getLocation() { // gets user's location
	if (navigator.geolocation) { // checks if navigator.geolocation is supported by browser
		navigator.geolocation.getCurrentPosition(function(position) {
				myLat = position.coords.latitude;
				myLong = position.coords.longitude;
				//getData(myLat,myLong);
				indicateCloserDiningHall();

			});
	} else {
		alert("Geolocation is not supported by your web browser. Sorry!");
	}
}

function indicateCloserDiningHall() {
	console.log("You: "+myLat+" "+myLong);
	console.log("Dewick: "+dewick.latitude+" "+dewick.longitude);
	console.log("Carm: "+carm.latitude+" "+carm.longitude);
	calcDistance(dewick);
	calcDistance(carm);

	// reveal closer dining hall
	if (dewick.distanceFrom < carm.distanceFrom) {
		console.log("You are closer to Dewick");
	}
	else if (dewick.distanceFrom > carm.distanceFrom) {
		console.log("You are closer to Carm");
	}
	else if (dewick.distanceFrom === carm.distanceFrom) {
		console.log("You are equally close to both Carm and Dewick");
	}

}

function calcDistance(dininghall) {
	var R = 6371; // km 
	
	// latitude difference
	var x1 = dininghall.latitude-myLat;
	var dLat = x1.toRad();

	// longitude difference
	var x2 = dininghall.longitude-myLong;
	var dLon = x2.toRad();

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
			Math.cos(myLat.toRad()) * Math.cos(dininghall.latitude.toRad()) * 
			Math.sin(dLon/2) * Math.sin(dLon/2);  
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var kmDistance = R * c;

	dininghall.distanceFrom = kmDistance;

	console.log("Distance to "+dininghall.name+": "+kmDistance);
}

Number.prototype.toRad = function() {
	return this * Math.PI / 180;
}





