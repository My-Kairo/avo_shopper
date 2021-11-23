const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');
const avoDeals = require('./avo-shopper');
const postgres = require('pg');
const Pool = postgres.Pool;

const app = express();

let useSSL = false;
let local = process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0" || false;
if (process.env.DATABASE_URL && !local) {
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/avocado';

const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
});

const avos = avoDeals(pool)

// const handlebarSetup = exphbs({
// 	partialsDir: "./views/partials",
// 	viewPath: "./views",
// 	layoutsDir: "./views/layouts",
//   });

  app.use(session({
	secret : "error messages",
	resave: false,
	saveUninitialized: true,
  }));

  app.use(flash())

// enable the req.body object - to allow us to use HTML forms
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable the static folder...
app.use(express.static('public'));

// add more middleware to allow for templating support

app.engine('handlebars', exphbs.engine());
// app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let counter = 0;

app.get('/', function(req, res) {
	res.render('index', {
		counter
	});
});

// start  the server and start listening for HTTP request on the PORT number specified...
let PORT = process.env.PORT || 1100;
app.listen(PORT, function() {
	console.log(`AvoApp started on port ${PORT}`)
});