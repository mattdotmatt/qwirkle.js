Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};

function randomSort(a, b) {
	// Get a random number between 0 and 10
	var temp = parseInt(Math.random() * 10);

	// Get 1 or 0, whether temp is odd or even
	var isOddOrEven = temp % 2;

	// Get +1 or -1, whether temp greater or smaller than 5
	var isPosOrNeg = temp > 5 ? 1 : -1;

	// Return -1, 0, or +1
	return (isOddOrEven * isPosOrNeg);
};

exports.Game = function() {
	var contents = [ 'st-r', 'st-r', 'st-r', 'st-y', 'st-y', 'st-y', 'st-b',
			'st-b', 'st-b', 'st-g', 'st-g', 'st-g', 'st-o', 'st-o', 'st-o',
			'st-p', 'st-p', 'st-p', 'cr-r', 'cr-r', 'cr-r', 'cr-y', 'cr-y',
			'cr-y', 'cr-b', 'cr-b', 'cr-b', 'cr-g', 'cr-g', 'cr-g', 'cr-o',
			'cr-o', 'cr-o', 'cr-p', 'cr-p', 'cr-p', 'di-r', 'di-r', 'di-r',
			'di-y', 'di-y', 'di-y', 'di-b', 'di-b', 'di-b', 'di-g', 'di-g',
			'di-g', 'di-o', 'di-o', 'di-o', 'di-p', 'di-p', 'di-p', 'ci-r',
			'ci-r', 'ci-r', 'ci-y', 'ci-y', 'ci-y', 'ci-b', 'ci-b', 'ci-b',
			'ci-g', 'ci-g', 'ci-g', 'ci-o', 'ci-o', 'ci-o', 'ci-p', 'ci-p',
			'ci-p', 'sq-r', 'sq-r', 'sq-r', 'sq-y', 'sq-y', 'sq-y', 'sq-b',
			'sq-b', 'sq-b', 'sq-g', 'sq-g', 'sq-g', 'sq-o', 'sq-o', 'sq-o',
			'sq-p', 'sq-p', 'sq-p', 'pl-r', 'pl-r', 'pl-r', 'pl-y', 'pl-y',
			'pl-y', 'pl-b', 'pl-b', 'pl-b', 'pl-g', 'pl-g', 'pl-g', 'pl-o',
			'pl-o', 'pl-o', 'pl-p', 'pl-p', 'pl-p' ];
	;
	var currentPlayers = [];
	var PlayerExists = function(playersName) {
		var playerExists = false;
		for ( var i = 0; i < currentPlayers.length; i++) {
			if (currentPlayers[i].name == playersName) {
				playerExists = true;
			}
		}
		return playerExists;
	};

	return {

		MyDetails : function(playersName) {

			for ( var i = 0; i < currentPlayers.length; i++) {
				if (currentPlayers[i].name == playersName) {
					return currentPlayers[i];
				}
			}
			return null;

		},

		players : {
			CurrentPlayers : function() {
				return currentPlayers;
			}
		},
		Leave : function(playersName) {
			for ( var i = 0; i < currentPlayers.length; i++) {
				if (currentPlayers[i].name == playersName) {
					currentPlayers.remove(i);
				}
			}

		},
		Join : function(playersName) {
			var playerAdded = false;

			if (currentPlayers.length !== 4) {
				if (!PlayerExists(playersName)) {

					var newPlayer = {
						name : playersName,
						hand : this.GetMyFirstTiles()
					};
					currentPlayers.push(newPlayer);
					playerAdded = true;
				}
			}
			return playerAdded;
		},
		Error : function() {
			return 'Bad move';
		},
		GetMyFirstTiles : function() {
			return this.ReplenishMyTiles(6);
		},
		TakeTurn : function(tilesToLay) {
			if (this.ValidateMove(tilesToLay)) {
				this.LayTiles(tilesToLay);
				this.ScoreMove(tilesToLay);
				return this.ReplenishMyTiles(tilesToLay.length);
			}
			return null;

		},
		LayTiles : function(tilesToLay) {
		},
		ValidateMove : function(tilesToLay) {
		},
		ScoreMove : function(tilesToLay) {
		},

		ReplenishMyTiles : function(numberOfTiles) {
			this.bag.Shake();
			var tiles = [];
			var tilesToReturn = numberOfTiles;
			if (this.bag.Contents().length < 6) {
				tilesToReturn = this.bag.Contents().length;
			}
			for ( var i = 0; i < tilesToReturn; i++) {
				tiles = tiles.concat(this.bag.Contents().pop());
			}
			return tiles;
		},
		bag : {

			Shake : function() {
				contents = contents.sort(randomSort);
			},

			Contents : function() {
				return contents;
			},

			IsFull : function() {
				return contents.length === 108;
			},

			IsEmpty : function() {
				return contents.length === 0;
			},

			Remove : function(numberToRemove) {
				if (numberToRemove > this.Contents().length) {
					this.Contents().length = 0;
				} else {
					this.Contents().length = this.Contents().length
							- numberToRemove;
				}
			},

			Empty : function() {
				contents.length = 0;
			}
		}
	};
};
