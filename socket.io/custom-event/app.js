
/**
 * Module dependencies.
 */

var express = require('express'),
    io = require('socket.io');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    title: 'Express'
  });
});

app.listen(3000);

io = io.listen(app);

io.configure(function(){
  io.enable('browser client etag');
  io.set('log level', 3);
  io.set('transports', [
    'websocket'
    , 'flashsocket'
    , 'htmlfile'
    , 'xhr-polling'
    , 'jsonp-polling'
    ]);
});

io.sockets.on('connection', function(socket) {
  console.log('connected');
  socket.on('disconnect', function() {
    console.log('Good-bye'); 
  });

  socket.on('message', function(msg) {
    console.log(msg);
    socket.emit('message', '반갑습니다.');
  });

  socket.on('from client', function(data) {
    console.log(data.text);
    socket.emit('from server', {text:'서버에서 보낸 메세지'});
  });
});

console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);