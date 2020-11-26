document.addEventListener("DOMContentLoaded", function() {
    var urlParams = new URLSearchParams(window.location.search);
    var idUrl = Number(urlParams.get("id"));
    var isFavorit = false
    checkData("teamFavorit", idUrl).then((msg) => {
        console.log(msg)
        document.getElementById("iconFav").classList.add('fas');
        document.getElementById("iconFav").classList.add('fa-star');
        document.getElementById("iconFav").innerHTML = "favorite"
        getSavedDataById("team")
        isFavorit = true
    }).catch((msg) => {
        console.log(msg)
        document.getElementById("iconFav").classList.remove('fas');
        document.getElementById("iconFav").classList.add('far');
        document.getElementById("iconFav").classList.add('fa-star');
        document.getElementById("iconFav").innerHTML = "favorite_border"
        getTeamDetails()
        isFavorit = false
    })

    var iconFav = document.getElementById("iconFav");

    iconFav.onclick = function() {
        console.log("Tombol Favorit di klik.");
        if (isFavorit) {
            deleteDatafav("teamFavorit", idUrl);
            isFavorit = false
        } else {
            items = getTeamDetails();
            items.then(function(team) {
                createDataFav("team", team);
            });
            isFavorit = true
        }
    };
});