var express = require('express');
var path = require('path');

var mongoose = require('mongoose');
var passport = require('passport');

// models import and passport configuration
require('./models/user').model();
//require('./models/dataset').model();
require('./passport')(passport);

//MongoDB connection
mongoose.connect('mongodb://localhost:27017/bogodata', function (err, res) {
    if (err) throw err;
    console.log('Successful connection to MongoDB');
});

// init express app
var app = express();

app.set('port', process.env.PORT || 80);
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.use(express.favicon('public/img/favicon.ico'));
app.use(express.logger('dev'));


app.use(express.cookieParser());
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());


app.use(express.static(path.join(__dirname, 'public')));


app.use(express.session({ secret: 'bogodata2014xyz' }));


app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);


if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/',  function (req, res) {
    res.sendfile('./views/index.html');
});

var authRoutes = require('./routes/auth')(app, passport);

// server start
app.listen(app.get('port'), function () {
    console.log('Listening port ' + app.get('port'));
});