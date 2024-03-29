/**
 * Module dependencies.
 */

var express = require('express'), stylus = require('stylus'), nib = require('nib'), sio = require('socket.io'), qwirkle = require('./qwirkle');

/**
 * App.
 */

var app = express.createServer();

/**
 * App configuration.
 */

app.configure(function() {
	app.use(stylus.middleware( {
		src : __dirname + '/public',
		compile : compile
	}));
	app.use(express.static(__dirname + '/public'));
	app.set('views', __dirname);
	app.set('view engine', 'jade');

	function compile(str, path) {
		return stylus(str).set('filename', path).use(nib());
	}
	;
});

/**
 * App routes.
 */

app.get('/', function(req, res) {
	res.render('index', {
		layout : false
	});
});

/**
 * App listen.
 */

app.listen(3000,
		function() {
			var addr = app.address();
			console.log('   app listening on http://' + addr.address + ':'
					+ addr.port);
		});

/**
 * Socket.IO server (single process only)
 */

var io = sio.listen(app), game = new qwirkle.Game();

io.sockets.on('connection', function(socket) {
	socket.on('user message', function(msg) {
		socket.broadcast.emit('user message', socket.nickname, msg);
	});

	socket.on('nickname', function(nick, fn) {

		if (!game.Join(nick)) {
			fn(true);
		} else {
			fn(false);
			socket.nickname = nick;
			socket.broadcast.emit('announcement', nick + ' connected');
			io.sockets.emit('nicknames', game.players.CurrentPlayers());
			io.sockets.emit('tiles', game.MyDetails(nick));
		}
	});

	socket.on('tiles', function() {
		socket.broadcast.emit('tiles', [ 1, 2, 3, 4 ]);

	});

	socket.on('disconnect', function() {
		if (!socket.nickname)
			return;

		game.Leave(socket.nickname);
		socket.broadcast
				.emit('announcement', socket.nickname + ' disconnected');
		socket.broadcast.emit('nicknames', game.players.CurrentPlayers());
	});
});