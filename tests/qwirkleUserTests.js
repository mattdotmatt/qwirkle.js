var vows = require('vows'), assert = require('assert'), Qwirkle = require('../qwirkle');

var Game = Qwirkle.Game;

vows.describe('My details at the start of the game').addBatch( {
	'When starting the game' : {
		topic : new (Game)(),
		'I should have my details set' : function(game) {
			var result = game.Join('matt');
			assert.equal(result, true);
			assert.equal(game.players.CurrentPlayers().length, 1);
			assert.equal(game.players.CurrentPlayers()[0].name, 'matt');
			assert.equal(game.players.CurrentPlayers()[0].hand.length, 6);
		},

		' And other users should have their details set' : function(game) {

			var result = game.Join('kerry');
			assert.equal(result, true);
			assert.equal(game.players.CurrentPlayers().length, 2);
			assert.equal(game.players.CurrentPlayers()[0].name, 'matt');
			assert.equal(game.players.CurrentPlayers()[0].hand.length, 6);
			assert.equal(game.players.CurrentPlayers()[1].name, 'kerry');
			assert.equal(game.players.CurrentPlayers()[1].hand.length, 6);

		},

		' But two users cant have the same name' : function(game) {
			var result = game.Join('matt');
			assert.equal(game.players.CurrentPlayers().length, 2);
			assert.equal(result, false);
		},

		' And there cannot be more than 4 players' : function(game) {
			game.Join('steve');
			var result = game.Join('nigel');
			assert.equal(result, true);
			assert.equal(game.players.CurrentPlayers().length, 4);

		}

	},
	
	'When leaving the game' : {
		topic : new (Game)(),
		'I should have my details removed' : function(game) {
			var result = game.Join('matt');
			assert.equal(result, true);
			assert.equal(game.players.CurrentPlayers().length, 1);
			game.Leave('matt');
			assert.equal(game.players.CurrentPlayers().length, 0);
		},
	}	
}).run(); // Run it

vows.describe('Getting my details').addBatch( {
	'When playing the game' : {
		topic : new (Game)(),
		'I should be able to get at my details' : function(game) {
			game.Join('matt');
			var myDetails = game.MyDetails('matt');
			assert.equal(myDetails.name, 'matt');
		}
	}
}).run(); // Run it
