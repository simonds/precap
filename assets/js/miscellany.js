Miscellany.js

//////////////////////////////////////////////////////////
// TESTING A UI BEHAVIOR FOR SHOWING THE SEND PALETTE
//////////////////////////////////////////////////////////
/*
var palette = $('Toolbar');
var sendView = $('SendView');
var precap = $('precap-12345');
var windowWidth = window.getWidth();
// sendView.setStyle('left', (windowWidth + 100)).set('tween', {duration: 100});

var sendSwipe_precap = function(i) {precap.setStyle('left', i);};
var sendSwipe_palette = function(i) {palette.setStyle('left', i);};
var sendSwipe_sendView = function(i) {sendView.setStyle('left', i);};

var sendSwipe_precap_fx = new Fx.Spring({
	'stiffness': 220,
	'friction': 15,
	'onMotion': sendSwipe_precap
});
var sendSwipe_palette_fx = new Fx.Spring({
	'stiffness': 220,
	'friction': 15,
	'onMotion': sendSwipe_palette
});
var sendSwipe_sendView_fx = new Fx.Spring({
	'stiffness': 220,
	'friction': 15,
	'onMotion': sendSwipe_sendView
});
$('Send').addEvent('click', function(){
	sendView.show();
	sendSwipe_precap_fx.start(0,-823);
	(function(){ sendSwipe_palette_fx.start(823,0); }.bind(this)).delay(75);
	(function(){ sendSwipe_sendView_fx.start(918,95); }.bind(this)).delay(150);
});
$('SendView').getElement('.CloseButton').addEvent('click', function(){
	sendSwipe_sendView_fx.start(95, windowWidth+100);
	(function(){ sendSwipe_palette_fx.start(0,823); }.bind(this)).delay(0);
	(function(){ sendSwipe_precap_fx.start(-823, 0); }.bind(this)).delay(50);
	(function(){ sendView.hide(); }.bind(this)).delay(350);
});
*/