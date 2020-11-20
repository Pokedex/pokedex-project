require('dotenv').config();
 
const bodyParser    = require('body-parser');
const cookieParser  = require('cookie-parser');
const express       = require('express');
const favicon       = require('serve-favicon');
const hbs           = require('hbs');
const mongoose      = require('mongoose');
const logger        = require('morgan');
const path          = require('path');
const chalk         = require('chalk');
const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session       = require('express-session');
const bcrypt        = require('bcrypt');
const flash         = require('connect-flash');
const Trainer       = require('./models/Trainer');

mongoose
  .connect(`mongodb+srv://Pokedex:${process.env.PASS}@cluster0.xeefh.mongodb.net/Pokédex?retryWrites=true&w=majority`, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true})
  .then(x => {
    console.log(chalk.greenBright.inverse.bold(`Connected to Mongo! Database name: "${x.connections[0].name}"`));
  })
  .catch(err => {
    console.error('Error connecting to mongo', err);
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Middleware de Session:
app.use(session({secret: 'hola', resave: true, saveUninitialized: true}));

// Middleware para serializar al user 
passport.serializeUser((user, callback)=>{
  callback(null, user._id);
});

// Middleware para des-serializar al user
passport.deserializeUser((id, callback)=>{
  Trainer.findById(id)
    .then((user)=>callback(null, user))
    .catch((err)=>callback(err));
});

// Middleware de flash
app.use(flash());

// Middleware de la Strategy
passport.use(new LocalStrategy({passReqToCallback: true, usernameField: 'email', passwordField: `password`}, (req, email, password, next)=>{
  Trainer.findOne({email})
    .then((trainer)=>{
      if(!trainer) return next(null, false, {message: 'Something went wrong, try again.'});
      if(!bcrypt.compareSync(password, trainer.password)) return next(null, false, {message: 'Something went wrong, try again.'});
      return next(null, trainer);
    })
    .catch((err)=>next(err));
}));

// Middleware de passport
app.use(passport.initialize());
app.use(passport.session());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'pokeball-3.png')));



// default value for title local
app.locals.title = 'Express - Generated with IronGenerator';



const index = require('./routes/index');
app.use('/', index);


module.exports = app;
