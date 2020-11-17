const express = require('express');
const router  = express.Router();
const Trainer = require('../models/Trainer.js');
const Pokemon = require('../models/Pokemon.js');


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/log-in', (req,res,next)=>{
  res.render('login');
});

router.get('/sign-up', (req,res,next)=>{
  res.render('signup');
});

router.get('/user-page', (req,res,next)=>{
  res.render('userpage');
});

router.get('/team', (req,res,next)=>{
  res.render('team');
});

router.get('/pokedex', (req,res,next)=>{
  res.render('pokedex');
});

router.get('/pokemon/:name', (req,res,next)=>{
  res.render('pokemon');
});

module.exports = router;
