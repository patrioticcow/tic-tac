'use strict';

// setup fb login congfig 
var provider = new firebase.auth.FacebookAuthProvider();
provider.setCustomParameters({'display': 'popup'});

firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		console.log(user);
		firebase.database().ref('users/' + user.uid).set({name: user.displayName, email: user.email, uid: user.uid});
		
		setItem('name', user.displayName);
		setItem('email', user.email);
		setItem('uid', user.uid);
	} else {
		if(window.location.pathname !== '/index.html') window.location.replace("/index.html");
	}
});

//
var errorMessage = $('#errorMessage');
var userId       = getItem('uid');
if(userId !== null) {
	var userName = getItem('name');
	$('#myUsername').html(userName);

	// database reference
	var database = firebase.database();

	setStatus(userId, 'open');
}

//facebook login/register user action
$(document).on('click', '#fbLogin', function() {
	firebase.auth().signInWithPopup(provider).then(function(result) {
		window.location.replace("/game.html");
	}).catch(function(error) {
		console.log(error);
		$('#errorMessage').html(error.code + ' ' + error.message);
	});
});

//logout user action
$(document).on('click', '#fbLogout', function() {
	firebase.auth().signOut().then(function() {
		removeItem('name');
		removeItem('email');
		removeItem('uid');
	}, function(error) {
		console.log(error);
	});
});


function setStatus(userId, status) {
  firebase.database().ref(status + '/' + userId).set({open: true});
}

function redirect(url, message) {
	url = url || "/index.html";
	
	if(message !== undefined) $('#errorMessage').html(message);
	window.location.replace(url);
}
