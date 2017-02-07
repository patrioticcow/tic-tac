'use strict';

// setup fb login config
var provider = new firebase.auth.FacebookAuthProvider();
provider.setCustomParameters({'display': 'popup'});

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        console.log(user);
        firebase.database().ref('users/' + user.uid).set({name: user.displayName, email: user.email, uid: user.uid});

        setItems({name: user.displayName, email: user.email, uid: user.uid});
    } else {
        if (window.location.pathname !== '/index.html') window.location.replace("/index.html");
    }
});


//
var userId = getItem('uid');

if (userId !== null) {
    var userName = getItem('name');
    $('#myUsername').html(userName);

    // database reference
    var database = firebase.database();

    // open status
    openStatus(userId);

    // set toggle status
    var status = getItem('status');
    $('#toggle-event').bootstrapToggle(status);

    // look for open games


}

// toggle status
$('#toggle-event').change(function () {
    console.log($(this).prop('checked'));

    if ($(this).prop('checked') === true) {
        openStatus(userId);
    } else {
        removeStatus(userId);
    }
});

//facebook login/register user action
$(document).on('click', '#fbLogin', function () {
    firebase.auth().signInWithPopup(provider).then(function (result) {
        window.location.replace("/game.html");
    }).catch(function (error) {
        console.log(error);
        $('#errorMessage').html(error.code + ' ' + error.message);
    });
});

//logout user action
$(document).on('click', '#fbLogout', function () {
    firebase.auth().signOut().then(function () {
        removeItems(['name', 'email', 'uid']);
    }, function (error) {
        console.log(error);
    });
});

function openStatus(userId) {
    setItem('status', 'on');
    firebase.database().ref('open/' + userId).set({open: true});
}

function removeStatus(userId) {
    setItem('status', 'off');
    firebase.database().ref('open/' + userId).remove();
}