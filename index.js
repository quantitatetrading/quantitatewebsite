var mongoose = require('mongoose');

let express = require('express');
var app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

mongoose.connect('mongodb://localhost/auth');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.get('/signup', (req, res) => {
  res.render('singup.ejs');
});


server = app.listen(3000);
var io = require('socket.io').listen(server);

var routes = require('./routes/authRoutes.js')(io);
app.use('/auth', routes);
