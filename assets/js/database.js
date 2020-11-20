function databasePromise(idb) {
    var dbPromise = idb.open("football-info", 1, function(upgradeDb) {
        if (!upgradeDb.objectStoreNames.contains("team_favorit")) {
            var indexFavTeam = upgradeDb.createObjectStore("teamFavorit", {
                keyPath: "id"
            });
            indexFavTeam.createIndex("nameTeam", "name", {
                unique: false
            });
        }

        if (!upgradeDb.objectStoreNames.contains("matchFavorit")) {
            var indexFavMatch = upgradeDb.createObjectStore("matchFavorit", {
                keyPath: "id"
            });
            indexFavMatch.createIndex("homeTeam", "match.homeTeam.name", {
                unique: false
            });
            indexFavMatch.createIndex("awayTeam", "match.awayTeam.name", {
                unique: false
            });
        }
    });

    return dbPromise;
}

function checkData(storeName, id) {
    return new Promise(function(resolve, reject) {
        databasePromise(idb)
            .then(function(db) {
                var tx = db.transaction(storeName, "readonly");
                var store = tx.objectStore(storeName);
                return store.get(id);
            })
            .then(function(data) {
                if (data != undefined) {
                    resolve("Data favorit")
                } else {
                    reject("Bukan data favorit")
                }
            });
    });
}

function createDataFav(dataType, data) {
    var storeName = "";
    var dataToCreate = {}
    if (dataType == "team") {
        storeName = "teamFavorit"
        dataToCreate = {
            id: data.id,
            name: data.name,
            shortName: data.shortName,
            tla: data.tla,
            crestUrl: data.crestUrl,
            address: data.address,
            phone: data.phone,
            website: data.website,
            email: data.email,
            founded: data.founded,
            clubColors: data.clubColors,
            venue: data.venue,
            squad: data.squad
        }
    } else if (dataType == "match") {
        storeName = "matchFavorit"
        dataToCreate = {
            id: data.match.id,
            head2head: {
                numberOfMatches: data.head2head.numberOfMatches,
                totalGoals: data.head2head.totalGoals,
                homeTeam: {
                    wins: data.head2head.homeTeam.wins,
                    draws: data.head2head.homeTeam.draws,
                    losses: data.head2head.homeTeam.losses
                },
                awayTeam: {
                    wins: data.head2head.awayTeam.wins,
                    draws: data.head2head.awayTeam.draws,
                    losses: data.head2head.awayTeam.losses
                }
            },
            match: {
                utcDate: data.match.utcDate,
                venue: data.match.venue,
                matchday: data.match.matchday,
                homeTeam: {
                    name: data.match.homeTeam.name
                },
                awayTeam: {
                    name: data.match.awayTeam.name
                }
            }
        }
    }

    databasePromise(idb).then(db => {
        const tx = db.transaction(storeName, 'readwrite');
        tx.objectStore(storeName).put(dataToCreate);

        return tx.complete;
    }).then(function() {
        console.log('Team berhasil disimpan.');
        document.getElementById("iconFav").classList.add('fas');
        document.getElementById("iconFav").classList.add('fa-star');
        document.getElementById("iconFav").innerHTML = "favorite";
        M.toast({
            html: 'Berhasil Di Favoritkan!'
        });
    }).catch(function() {
        M.toast({
            html: 'Terjadi Kesalahan'
        });
    });
}

function deleteDatafav(storeName, data) {
    databasePromise(idb).then(function(db) {
        var tx = db.transaction(storeName, 'readwrite');
        var store = tx.objectStore(storeName);
        store.delete(data);
        return tx.complete;
    }).then(function() {
        console.log('Item deleted');
        document.getElementById("iconFav").classList.remove('fas');
        document.getElementById("iconFav").classList.add('far');
        document.getElementById("iconFav").classList.add('fa-star');
        document.getElementById("iconFav").innerHTML = "favorite_border";
        M.toast({
            html: 'Data berhasil dihapus dari Favorit!'
        });
    }).catch(function() {
        M.toast({
            html: 'Terjadi Kesalahan'
        });
    });
}

function getSavedDataById(dataType) {
    var urlParams = new URLSearchParams(window.location.search);
    var idParam = Number(urlParams.get("id"));

    if (dataType == "team") {
        var dataSquadHTML = ''
        var tableSquadHTML = ''
        getDataById("teamFavorit", idParam).then(function(team) {
            getTeamDetails(team)
            dataTeamJSON = team;
            team.squad.forEach(function(squad) {
                dataSquadJSON = squad;
                dataSquadHTML += `
                    <tr>
                        <td><a>${squad.name}</a></td>
                        <td>${squad.position}</td>
                    </tr>`
            });
            tableSquadHTML += `<table> <tbody> ${dataSquadHTML}  </tbody> </table>`
            document.getElementById("squad").innerHTML = tableSquadHTML;
        })
    } else if (dataType == "match") {
        getDataById("matchFavorit", idParam).then(function(match) {
            matchesDetailsData(match);
        });
    }
}

function getDataById(storeName, id) {
    return new Promise(function(resolve, reject) {
        databasePromise(idb)
            .then(function(db) {
                var tx = db.transaction(storeName, "readonly");
                var store = tx.objectStore(storeName);
                return store.get(id);
            })
            .then(function(data) {
                resolve(data);
            });
    });
}

function getAllData(storeName) {
    return new Promise(function(resolve, reject) {
        databasePromise(idb)
            .then(function(db) {
                var tx = db.transaction(storeName, "readonly");
                var store = tx.objectStore(storeName);
                return store.getAll();
            })
            .then(function(data) {
                resolve(data);
            });
    });
}

function getFavorit(dataType) {
    if (dataType == "team") {
        getAllData("teamFavorit").then(function(data) {
            getFavoritTeam(data);
        });
    } else if (dataType == "match") {
        getAllData("matchFavorit").then(function(data) {
            getFavoritMatch(data);
        });
    }
}