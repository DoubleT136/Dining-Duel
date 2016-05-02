function loadBar() {
    var inc = 0;
    if (carmResults < 0) {
        if (dewickResults < carmResults) {
            inc = Math.abs(dewickResults * 2);
        }
        inc = Math.abs(carmResults * 2);
    } else if (dewickResults < 0) {
        inc = Math.abs(dewickResults * 2);
    }

    if (carmResults === 0 || dewickResults === 0) {
        inc += Math.max(carmResults, dewickResults);
    }

    carmResults += inc;
    dewickResults += inc;

    totalResults = carmResults + dewickResults;

    carmPerc = carmResults / totalResults * 100;
    carmPerc = keepAboveFifteen(carmPerc);
    $("#carm").css("width", (carmPerc - 0.2) + "%");

    dewPerc = 100 - carmPerc;
    dewPerc = keepAboveFifteen(dewPerc);
    $("#dewick").css("width", (dewPerc - 0.2) + "%");
    console.log(carmResults, dewickResults);
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
