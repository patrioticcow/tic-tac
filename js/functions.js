'use strict';

function getItem(key)
{
    var r = localStorage.getItem(key);

    return JSON.parse(r);
}

function setItem(key, value)
{
    localStorage.setItem(key, JSON.stringify(value));
}

function removeItem(key, value)
{
    localStorage.removeItem(key, value);
}