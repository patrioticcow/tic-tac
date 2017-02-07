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