var vows = require('vows'), assert = require('assert'), Qwirkle = require('../qwirkle');

var Game = Qwirkle.Game;
vows.describe('Bag contents at the start of the game').addBatch( {
	'When starting the game' : {
		topic : new (Game)(),
		'the bag should contain 108 tiles' : function(game) {
			assert.equal(game.bag.Contents().length, 108);
		}
	},
	'and' : {
		topic : new (Game)(),
		'the bag should be full' : function(game) {
			assert.equal(game.bag.IsFull(), true);
		}
	}
}).run(); // Run it

vows
		.describe('Bag contents when playing the game')
		.addBatch(
				{

					'When taking a turn of 6 tiles' : {
						topic : new (Game)(),
						' you should get back 6 tiles' : function(game) {
							var tiles = game.ReplenishMyTiles(6);
							assert.equal(tiles.length, 6);
						}
					},
					'and the bag' : {
						topic : new (Game)(),
						'should remove 6 tiles' : function(game) {
							game.ReplenishMyTiles(6);
							assert.equal(game.bag.Contents().length, 102);
						}
					},
					'When playing the game, taking a turn when fewer than 6 tiles left' : {
						topic : new (Game)(),
						'should leave 0 tiles' : function(game) {
							game.bag.Contents().length = 4;
							game.ReplenishMyTiles(6);
							assert.equal(game.bag.Contents().length, 0);
						}
					},
					'When playing the game, when no tiles are left' : {
						topic : new (Game)(),
						'the bag should be empty' : function(game) {
							game.bag.Contents().length = 0;
							assert.equal(game.bag.IsEmpty(), true);
						}
					},
					'When taking all the turns' : {
						topic : new (Game)(),
						' you should get back 108 tiles' : function(game) {
							// dont sort!
							game.bag.Shake = function() {
							};

							var allTiles = [];
							while (!game.bag.IsEmpty()) {
								var tiles = game.ReplenishMyTiles(6);
								allTiles = allTiles.concat(tiles);
							}

							assert.equal(allTiles.length, 108);

							var expected = [ 'st-r', 'st-r', 'st-r', 'st-y',
									'st-y', 'st-y', 'st-b', 'st-b', 'st-b',
									'st-g', 'st-g', 'st-g', 'st-o', 'st-o',
									'st-o', 'st-p', 'st-p', 'st-p', 'cr-r',
									'cr-r', 'cr-r', 'cr-y', 'cr-y', 'cr-y',
									'cr-b', 'cr-b', 'cr-b', 'cr-g', 'cr-g',
									'cr-g', 'cr-o', 'cr-o', 'cr-o', 'cr-p',
									'cr-p', 'cr-p', 'di-r', 'di-r', 'di-r',
									'di-y', 'di-y', 'di-y', 'di-b', 'di-b',
									'di-b', 'di-g', 'di-g', 'di-g', 'di-o',
									'di-o', 'di-o', 'di-p', 'di-p', 'di-p',
									'ci-r', 'ci-r', 'ci-r', 'ci-y', 'ci-y',
									'ci-y', 'ci-b', 'ci-b', 'ci-b', 'ci-g',
									'ci-g', 'ci-g', 'ci-o', 'ci-o', 'ci-o',
									'ci-p', 'ci-p', 'ci-p', 'sq-r', 'sq-r',
									'sq-r', 'sq-y', 'sq-y', 'sq-y', 'sq-b',
									'sq-b', 'sq-b', 'sq-g', 'sq-g', 'sq-g',
									'sq-o', 'sq-o', 'sq-o', 'sq-p', 'sq-p',
									'sq-p', 'pl-r', 'pl-r', 'pl-r', 'pl-y',
									'pl-y', 'pl-y', 'pl-b', 'pl-b', 'pl-b',
									'pl-g', 'pl-g', 'pl-g', 'pl-o', 'pl-o',
									'pl-o', 'pl-p', 'pl-p', 'pl-p' ];

							var reversedTiles = allTiles.reverse();
							for ( var i = 0; i < 108; i++) {
								assert.equal(reversedTiles[i], expected[i]);
							}
						}
					},
					'When taking all the turns with a limited set' : {
						topic : new (Game)(),
						' you should get back the full set used' : function(
								game) {
							game.bag.Contents = function() {
								return [ 'sr', 'sc', 'sr' ];
							};
							var allTiles = game.ReplenishMyTiles(3);
							assert.equal(allTiles.length, 3);
						}
					}

				}).run(); // Run it

vows.describe('Shaking the bag').addBatch( {

	'When taking a turn' : {
		topic : new (Game)(),
		' the bag should be shaken' : function(game) {
			var count = 0;
			game.bag.Shake = function() {
				count++;
			};
			var tiles = game.ReplenishMyTiles(1);
			assert.equal(count, 1);
		}
	}
}).run(); // Run it

vows.describe('My tiles').addBatch( {

	'When starting the game' : {
		topic : new (Game)(),
		' I should have 6 tiles from the bag' : function(game) {

			var myTiles = game.GetMyFirstTiles();
			assert.equal(myTiles.length, 6);
			assert.equal(game.bag.Contents().length, 102);
		}
	}
}).run(); // Run it

vows.describe('Laying the tiles').addBatch( {

	'When laying 3 tiles' : {
		topic : new (Game)(),
		' 3 tiles should be retrieved from the bag' : function(game) {
			var tilesToLay = [ {
				positionX : "1",
				positionY : "1",
				tile : "st-r"
			}, {
				positionX : "2",
				positionY : "1",
				tile : "st-r"
			}, {
				positionX : "3",
				positionY : "1",
				tile : "st-r"
			} ];
			var myNewTiles = game.TakeTurn(tilesToLay);
			assert.equal(myNewTiles.length, 3);
			assert.equal(game.bag.Contents().length, 105);

		}
	}

}).run(); // Run it

vows
		.describe('Game flow')
		.addBatch(
				{

					'When playing the game' : {
						topic : new (Game)(),
						' the following steps should be taken when a move is good' : function(
								game) {

							var tilesToLay = [ {
								positionX : "1",
								positionY : "1",
								tile : "st-r"
							}, {
								positionX : "2",
								positionY : "1",
								tile : "st-r"
							}, {
								positionX : "3",
								positionY : "1",
								tile : "st-r"
							} ];

							// LayTiles
							// ValidateMove
							// ShakeBag
							// GetTiles

							var countLay = 0;
							var countValidate = 0;
							var countGetTiles = 0;

							game.LayTiles = function() {
								countLay++;
								return true;
							};

							game.ValidateMove = function() {
								countValidate++;
								return true;
							};

							game.ReplenishMyTiles = function() {
								countGetTiles++;
								return true;
							};

							game.TakeTurn(tilesToLay);

							assert.equal(countLay, 1);
							assert.equal(countValidate, 1);
							assert.equal(countGetTiles, 1);

						}
					}
				}).run(); // Run it
