const process = require("process");
require('dotenv').config();
const express = require("express");
const multer = require("multer");
const swig = require("swig");
const app = express();
const upload = multer({dest:'./tmp'});
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const {Strategy:LocalStrategy} = require('passport-local');
const {knex,models,} = require('./db'); 
const {body,check,} = require('express-validator');
const ah = require('express-async-handler');
const validator = require('validator');

const options = {
  dotfiles: 'ignore',
  etag: true,
  extensions: false,
  index: false,
  maxAge: '1d',
  redirect: false,
  setHeaders: function (res, path, stat) {
    res.set('x-timestamp', Date.now())
  }
};
app.use(express.static('asset', options));

app.use(session({
	resave: false,
	secret: 'hello',
	saveUninitialized: false
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(passport.initialize());
app.use(passport.session());
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', false);
swig.setDefaults({ cache: false });

passport.use(new LocalStrategy({
	usernameField: 'login',
	passwordField: 'password',
	passReqToCallback: true,
	session: true,
}, async (req, login, password, done) => {
	// const [user] = await knex.from('user').where({login, password});
	const [user] = await models.user.query().where($ => $.where({login, password}));
	if(user){ 
		done(null,user);
	}else{
		done(new Error('user unknown!'));
	}
}));
passport.serializeUser( async (user, done) => {
	done(null, user.userId);
});
passport.deserializeUser( async (userId, done) => {
	// const [user] = await knex.from('user').where({userId});
	const [user] = await models.user.query().where($ => $.where({userId}));
	done(user ? null : new Error('user unknown!'), user.toJSON());
});

app.get('/', async(req, res) =>{
	res.render('index', {});
});
app.get('/login', async(req, res) =>{
	res.render('login-form', {});
});
app.post(
	'/login',
	upload.any(),
	// ah(async (req, res, next) => {
	// 	//await check('login').isLenght({min: 1, max: 32}).withMessage('login incorrect').run(req);
	// 	//await check('password').if(value => validator.isLenght({min:1, max:32})).run(req);
	// 	next();
	// }),
	passport.authenticate('local', {session: true, failureRedirect: '/error'}), 
	async(req, res) =>{
		//res.json({data: req.user});
		res.redirect('/info');
	});

app.get('/logout', async(req, res) => {
	if(req.user) {
		req.logOut();
		//res.json({data: true});
		res.redirect('/login');
	} else{
		res.status(403).end('User not found');
	}
})

app.get('/info', async(req, res) => {
	if(req.user) {
		res.render('info', {user: req.user});
	} else {
		res.redirect('/login');
	}
})

app.get('/reg', async(req, res) =>{
	res.render('registration', {});
});

app.post(
	'/reg',
	upload.any(),
	// ah(async (req, res, next) => {
	// 	//await check('login').isLenght({min: 1, max: 32}).withMessage('login incorrect').run(req);
	// 	//await check('password').if(value => validator.isLenght({min:1, max:32})).run(req);
	// 	next();
	// }), 
	async(req, res) => {
		const {login, password} = req.body;
		const exists = await models.user.query().findOne({login,});
		if(exists) {
			res.status(403).end();
		} else {
			await models.user.query().insert({login, password});
			res.redirect('/login');
		}
	});

app.all('*', async(error, req, res, next) => {
	res.status(404).json({error,});
})

app.listen(process.env.PORT);
