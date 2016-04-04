// numSource.js


function getRandom(min, max) {
	return Math.random() * (max - min) + min;
}

function keepAboveFifteen(perc) {

	if (perc < 15) {
		return 15;
	} else if (perc > 85) {
		return 85;
	} else {
		return perc;
	}
}