//mod.js

function loadBar() {

    totalResults = carmResults + dewickResults;

    carmPerc = carmResults / totalResults * 100;
    carmPerc = keepAboveFifteen(carmPerc);
    $("#carm").css("width", (carmPerc - 0.2) + "%");

    dewPerc = 100 - carmPerc;
    dewPerc = keepAboveFifteen(dewPerc);
    $("#dewick").css("width", (dewPerc - 0.2) + "%");
}

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

