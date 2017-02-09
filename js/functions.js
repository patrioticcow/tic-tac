'use strict';

function getItem(key) {
    var r = localStorage.getItem(key);

    return JSON.parse(r);
}

function setItems(obj) {
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) setItem(key, obj[key]);
    }
}

function setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function removeItem(key) {
    localStorage.removeItem(key);
}

function removeItems(arr) {
    for (var i = 0; i < arr.length; i++) {
        localStorage.removeItem(arr[i]);
    }
}


/**/

/**
 * find a open user
 * @param userId
 * @returns {*|{name}}
 */
function getOpenUserPromise(userId) {
    return firebase.database().ref('/open').limitToFirst(3).once('value').then(function (snapshot) {
        var open = snapshot.val();

        if (open === null) return null;

        for (var id in open) {
            if (open.hasOwnProperty(id) && userId !== id) return id;
        }

        return null;
    });
}

/**
 * check the lobby
 * @param userId
 * @returns {*|{name}}
 */
function checkTheLobbyPromise(userId) {
    return firebase.database().ref('/lobby/' + userId).limitToFirst(3).once('value').then(function (snapshot) {
        var resp = snapshot.val();

        if (resp === null) return null;

        return resp;
    });
}