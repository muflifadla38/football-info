var api_url = "https://api.football-data.org/v2/";
var token = "1674c06616cb4a0aa020848fc8b046c4";
var liga_id = "2021";
var standings = `${api_url}competitions/${liga_id}/standings?standingType=TOTAL`;
var team = `${api_url}teams/`;
var matches = `${api_url}competitions/${liga_id}/matches?matchday=9`;
var matchDetail = `${api_url}matches/`;

function fetchData(url) {
    return fetch(url, {
        method: "GET",
        headers: {
            'X-Auth-Token': token
        }
    })
}

function status(response) {
    if (response.status !== 200) {
        console.log("Error : " + response.status);
        return Promise.reject(new Error(response.statusText));
    } else {
        return Promise.resolve(response);
    }
}

function json(response) {
    return response.json();
}

function error(error) {
    console.log("Error : " + error);
}

//Halaman Home
function getStandings() {
    if ('caches' in window) {
        caches.match(standings).then(function(response) {
            if (response) {
                response.json().then(function(data) {
                    standingMatchData(data);
                });
            }
        });
    }

    fetchData(standings)
        .then(status)
        .then(json)
        .then(function(data) {
            standingMatchData(data)
        })
        .catch(error);
}

//Halaman Detail Team
function getTeamDetails() {
    return new Promise(function(resolve, reject) {
        var urlParams = new URLSearchParams(window.location.search);
        var idUrl = urlParams.get("id");
        if ("caches" in window) {
            caches.match(team + idUrl).then(function(response) {
                if (response) {
                    response.json().then(function(data) {
                        teamDetailsData(data)
                        teamSquadData(data)
                        resolve(data);
                    });
                }
            });
        }

        fetchData(team + idUrl)
            .then(status)
            .then(json)
            .then(function(data) {
                teamDetailsData(data)
                teamSquadData(data)
                resolve(data);
            })
            .catch(error);
    });
}

//Halaman Match
function getMatches() {
    return new Promise(function(resolve, reject) {
        if ('caches' in window) {
            caches.match(matches).then(function(response) {
                if (response) {
                    response.json().then(function(data) {
                        matchesData(data);
                        resolve(data);
                    });
                }
            });
        }

        fetchData(matches)
            .then(status)
            .then(json)
            .then(function(data) {
                matchesData(data);
                resolve(data);
            })
            .catch(error);
    });
}

//Halaman Detail Match
function getMatchesDetails() {
    return new Promise(function(resolve, reject) {
        var urlParams = new URLSearchParams(window.location.search);
        var idUrl = urlParams.get("id");
        if ('caches' in window) {
            caches.match(matchDetail + idUrl).then(function(response) {
                if (response) {
                    response.json().then(function(data) {
                        matchesDetailsData(data);
                        resolve(data)
                    });
                }
            });
        }
        fetchData(matchDetail + idUrl)
            .then(status)
            .then(json)
            .then(function(data) {
                matchesDetailsData(data);
                resolve(data);
            })
            .catch(error);
    });
}

//API Home
function standingMatchData(data) {
    var standingData = ''
    var dataHeaderTable = ''
    data.standings.forEach(function(team) {
        team.table.forEach(function(standingMatch) {
            standingMatch = JSON.parse(JSON.stringify(standingMatch).replace(/http:/g, 'https:'));
            standingData += `
                <tr>
                    <td>${standingMatch.position}</td>
                    <td>
                        <a href="./standing-details.html?id=${standingMatch.team.id}" class="link-to-team valign-wrapper teal-text text-darken-3">
                            <img src="${standingMatch.team.crestUrl}" class="responsive-img" alt="logo-team" width="20em" style="margin-right: 1em">${standingMatch.team.name}
                        </a> 
                    </td>
                    <td>${standingMatch.playedGames}</td>
                    <td>${standingMatch.won}</td>
                    <td>${standingMatch.draw}</td>
                    <td>${standingMatch.lost}</td>
                    <td>${standingMatch.goalsFor}</td>
                    <td>${standingMatch.goalsAgainst}</td>
                    <td>${standingMatch.goalDifference}</td>
                    <td>${standingMatch.points}</td>
                </tr>`
        })
    });

    document.getElementById("standings-content").innerHTML = standingData;

    data = JSON.parse(JSON.stringify(data).replace(/http:/g, 'https:'));
    dataHeaderTable += `
        <h4 class="a-font-bold a-mb-2">${data.competition.name}</h4>
        <h6 class="a-font-bold a-mb-2">Last Updated: ${convertDate(new Date(data.competition.lastUpdated))}</h6>`;
    document.getElementById("update-date").innerHTML = dataHeaderTable;
    document.getElementById("preloader").innerHTML = "";
}

//API Detail Team
function teamDetailsData(data) {
    data = JSON.parse(JSON.stringify(data).replace(/http:/g, 'https:'));
    document.getElementById("name").innerHTML = data.name;
    document.getElementById("crestUrl").src = data.crestUrl;
    document.getElementById("name").innerHTML = data.name;
    document.getElementById("shortName").innerHTML = data.shortName;
    document.getElementById("tla").innerHTML = data.tla;
    document.getElementById("address").innerHTML = data.address;
    document.getElementById("phone").innerHTML = data.phone;
    document.getElementById("website").innerHTML = data.website;
    document.getElementById("email").innerHTML = data.email;
    document.getElementById("founded").innerHTML = data.founded;
    document.getElementById("clubColors").innerHTML = data.clubColors;
    document.getElementById("venue").innerHTML = data.venue;
    document.getElementById("preloader").innerHTML = '';
}

//API Detail Team - Squad Section
function teamSquadData(data) {
    var dataSquadHTML = ''
    var tabelSquadHTML = ''

    data.squad.forEach(function(squad, index) {
        dataSquadJSON = squad;

        if (squad.position == null) {
            squad.position = "-"
        }

        dataSquadHTML += `
            <tr>
                <td>${squad.name}</td>
                <td>${squad.position}</td>
            </tr>`
    });

    tabelSquadHTML += `
        <table class="striped centered">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Position</th>
                </tr>
            </thead>
            <tbody>${dataSquadHTML}</tbody>
        </table>`

    document.getElementById("squad").innerHTML = tabelSquadHTML;
}

//API Match
function matchesData(data) {
    var matchData = ''
    data.matches.forEach(function(match) {
        matchData += `
            <div class="col s12 m6 l6">
                <div class="card teal lighten-5">
                    <div class="card-content">
                        <div center-align>
                            <h5 class="center-align">Matchday : ${match.matchday}</h5>
                            <div class="center-align">Kick Off : ${convertDate(new Date(match.utcDate))}</div>
                            <div class="row" style="margin:20px">
                                <div class="col s5 truncate text-center">
                                    <p class="teal-text text-darken-2">${match.homeTeam.name}</p>
                                </div>
                                <div class="col s2"><h5>VS</h5></div>
                                <div class="col s5 truncate text-center">
                                    <p class="teal-text text-darken-2">${match.awayTeam.name}</p>
                                </div>
                            </div>
                            <div class="center-align">
                                <a class="red accent-1 waves-effect waves-light btn" href="./match-detail.html?id=${match.id}">Lihat Detail</a>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>`
    });

    document.getElementById("matches-content").innerHTML = matchData;
    document.getElementById("preloader").innerHTML = "";
}

//API Detail Match
function matchesDetailsData(data) {
    document.getElementById("matchDay").innerHTML = `Matchday: ${data.match.matchday}`;
    document.getElementById("kickOff").innerHTML = `Kick Off: ${convertDate(new Date(data.match.utcDate))}`;
    document.getElementById("homeTeamName").innerHTML = data.match.homeTeam.name;
    document.getElementById("awayTeamName").innerHTML = data.match.awayTeam.name;
    document.getElementById("numberOfMatches").innerHTML = `Number Of Matches: ${data.head2head.numberOfMatches}`;
    document.getElementById("totalGoals").innerHTML = `Total Goals: ${data.head2head.totalGoals}`;
    document.getElementById("homeTeamWins").innerHTML = data.head2head.homeTeam.wins;
    document.getElementById("awayTeamWins").innerHTML = data.head2head.awayTeam.wins;
    document.getElementById("homeTeamDraws").innerHTML = data.head2head.homeTeam.draws;
    document.getElementById("awayTeamDraws").innerHTML = data.head2head.awayTeam.draws;
    document.getElementById("homeTeamLosses").innerHTML = data.head2head.homeTeam.losses;
    document.getElementById("awayTeamLosses").innerHTML = data.head2head.awayTeam.losses;
    document.getElementById("venue").innerHTML = data.match.venue;
    document.getElementById("preloader").innerHTML = "";
}

//API halman Favorit Team
function getFavoritTeam(data) {
    var dataTeamFavHtml = ''
    data.forEach(function(team) {
        dataTeamFavHtml += `
            <div class="col s12 m6 l6">
                <div class="card teal lighten-5">
                    <div class="card-content">
                        <div class="center-align">
                            <h5 class="center-align">
                                <span class="center-align">  
                                    <img src="${team.crestUrl}" alt="logo" height="50em" vspace="25">
                                    <br><a class="teal-text" href="./standing-details.html?id=${team.id}">${team.name}</a>
                                </span>
                            </h5>          
                        </div>
                    </div>
                </div>
            </div>`
    });

    document.getElementById("favorit-content").innerHTML = dataTeamFavHtml;
    document.getElementById("preloader").innerHTML = "";
}

//API halman Favorit Match
function getFavoritMatch(data) {
    var dataMatchFavHtml = ''
    data.forEach(function(match) {
        dataMatchFavHtml += `
            <div class="col s12 m6 l6">
                <div class="card teal lighten-5">
                    <div class="card-content">
                        <div center-align>
                            <h5 class="center-align">Matchday : ${match.match.matchday}</h5>
                            <div class="center-align">Kick Off : ${convertDate(new Date(match.match.utcDate))}</div>
                            <div class="row" style="margin:20px">
                                <div class="col s5 truncate text-center">
                                    <p class="teal-text text-darken-2">${match.match.homeTeam.name}</p>
                                </div>
                                <div class="col s2"><h5>VS</h5></div>
                                <div class="col s5 truncate text-center">
                                    <p class="teal-text text-darken-2">${match.match.awayTeam.name}</p>
                                </div>
                            </div>
                            <div class="center-align">
                                <a class="red accent-1 waves-effect waves-light btn" href="./match-detail.html?id=${match.id}">Lihat Detail</a>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>`
    });

    // Sisipkan komponen card ke dalam elemen dengan id divFavorit
    document.getElementById("favorit-content").innerHTML = dataMatchFavHtml;
    document.getElementById("preloader").innerHTML = "";
}
