const express  = require('express');
const router   = express.Router();
const bcrypt   = require('bcrypt');
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const Trainer  = require('../models/Trainer.js');
const Pokemon  = require('../models/Pokemon.js');


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/signup', (req,res,next)=>{
  res.render('signup');
});

router.post('/signup', (req, res, next)=>{
  const {name, age, email, password} = req.body;

  if(name === '' || age === '' || email === '' || password === ''){
    res.render('signup', {errorMessage: 'You have to fill all the fields.'})
    return;
  }

  Trainer.findOne({name})
  .then((result)=>{
    if(!result){
      bcrypt.hash(password, 10)
      .then((hashedPass)=>{
        Trainer.create({name, age, email, password: hashedPass})
        .then((result)=>res.redirect('/login'));
      })
    } else {
      res.render('signup', {errorMessage: 'This trainer already exists, please try again.'})
    }
  })
  .catch((err)=>res.send(err));


});

router.get('/login', (req, res, next)=>{
  res.render('login', {errorMessage: req.flash('error')});
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/userpage',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}));

router.get('/logout', (req,res,next)=>{
  req.logOut();
  res.redirect('/');
});

router.get('/userpage', ensureLogin.ensureLoggedIn(), (req,res,next)=>{
  


  res.render('userpage');
});

router.get('/team', ensureLogin.ensureLoggedIn(), (req,res,next)=>{

  Trainer.findOne({email: req.user.email})
    .then((result)=>{
      // console.log(result);
      // pokeArr = [];
      // result.team.forEach((pokemon)=>{
      //   pokeArr.push(pokemon);
      // });
      res.render('team', result);
    })
    .catch((err)=>{
      res.send(err);
    })
});

router.get('/pokedex', (req,res,next)=>{
  res.render('pokedex');
});

router.get('/pokemon/:name', (req,res,next)=>{
  const name = req.params.name;


  res.render('pokemon');
});

module.exports = router;
  
