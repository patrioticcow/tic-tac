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

    // open status
    openStatus(userId);

    // set toggle status
    var status = getItem('status');
    $('#toggle-event').bootstrapToggle(status);


    // look in the lobby
    var checkTheGameRoom = checkTheRoomPromise(userId, 'game');
    checkTheGameRoom.then(function (resp) {
        if (resp !== null) {
            console.log('we have a game');
            console.log({me: userId, opponent: resp.other_user_id});

            setItems({me: userId, opponent: resp.other_user_id, game_status: 'open'});

            $('#progressBar').hide();
        }

        if (resp === null) {
            // look in the lobby
            var checkTheLobby = checkTheRoomPromise(userId);
            checkTheLobby.then(function (resp) {
                if (resp !== null) {
                    // check if the partner has left
                    var otherUserId = checkTheRoomPromise(resp.other_user_id);
                    otherUserId.then(function (other) {
                        var userId = resp.other_user_id;
                        var id     = other.other_user_id;

                        // remove user from lobby
                        firebase.database().ref('lobby/' + userId).remove();
                        firebase.database().ref('lobby/' + id).remove();

                        // move the id to the game
                        firebase.database().ref('game/' + userId).set({other_user_id: id});
                        firebase.database().ref('game/' + id).set({other_user_id: userId});

                        // let the game begin
                        console.log({me: id, opponent: userId});
                        setItems({me: id, opponent: userId});
                    });
                } else {
                    // look for open games
                    var getOpenUser = getOpenUserPromise(userId);
                    getOpenUser.then(function (id) {
                        console.log('other_user_id', id);

                        if (id !== null) {
                            // remove user from open
                            firebase.database().ref('open/' + userId).remove();
                            firebase.database().ref('open/' + id).remove();

                            // move the id to the lobby
                            firebase.database().ref('lobby/' + userId).set({other_user_id: id});
                            firebase.database().ref('lobby/' + id).set({other_user_id: userId});
                        } else {

                        }
                    });
                }
            });
        }
    });


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