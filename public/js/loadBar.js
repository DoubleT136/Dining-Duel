function loadBar() {
    // calculate score change ratio based on distance
    var carmFactor = 1 + (1 / (10 * carmDistance.distanceFrom + 1));
    var dewickFactor = 1 + (1 / (10 * dewickDistance.distanceFrom + 1));
    var inc = 0;
    if (carmResults < 0) {
        if (dewickResults < carmResults) {
            inc = Math.abs(dewickResults * 2);
        } else {
            inc = Math.abs(carmResults * 2);
        }
    } else if (dewickResults < 0) {
        inc = Math.abs(dewickResults * 2);
    }

    if (carmResults === 0 || dewickResults === 0) {
        inc += Math.max(carmResults, dewickResults);
    }

    carmResults += inc;
    dewickResults += inc;
    carmResults *= carmFactor;
    dewickResults *= dewickFactor;
    totalResults = carmResults + dewickResults;

    carmPerc = carmResults / totalResults * 100;
    carmPerc = keepAboveFifteen(carmPerc);
    $("#carm").css("width", (carmPerc - 0.2) + "%");

    dewPerc = 100 - carmPerc;
    dewPerc = keepAboveFifteen(dewPerc);
    $("#dewick").css("width", (dewPerc - 0.2) + "%");
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
