var express = require('express');
var bodyparser = require('body-parser');
var app = express();
var helmet = require('helmet');
var session = require('express-session');
var mongoDb = require('./utility/DBconnection');

mongoDb.connectDB();

//setting helmet js for cCSS attacks
app.use(helmet());

app.use(session({ secret : 'user',
  resave: false,
  saveUninitialized: true,
  cookie: { }
}));
app.set('view engine', 'ejs');

app.use('/assets', express.static('assets'));

// using connections route handler in connections.js
var con = require('./routes/connection.js');
app.use('/',con);

var savedCon = require('./routes/userProfile.js');
app.use('/',savedCon);


// using index route handler in index.js
var indexParam = require('./routes/index.js');
app.use('/',indexParam);

app.listen(3001);
