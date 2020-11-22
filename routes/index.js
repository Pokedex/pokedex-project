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
        .then(()=>res.redirect('/login'));
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
      res.render('team', result);
    })
    .catch((err)=>{
      res.send(err);
    });
});

router.get('/pokedex', ensureLogin.ensureLoggedIn(), (req,res,next)=>{
  const name = req.params.name;
  const email = req.user.email;
  const captured = req.user.captured;
  const newCaptured = [...captured, name];
  const newString = newCaptured.join('-');
  Pokemon.find({trainer: email})
    .then((result)=>{
      res.render('pokedex', {string: newString, result});
    })
    .catch((err)=>{
      console.log(err);
    });
});

router.get('/captured', ensureLogin.ensureLoggedIn(), (req,res,next)=>{
  Trainer.findOne({email: req.user.email})
    .then((result)=>{
      res.render('captured', result);
    })
    .catch((err)=>{
      res.send(err);
    });
});

router.get('/pokemon/:name', ensureLogin.ensureLoggedIn(), (req,res,next)=>{
  res.render('pokemon');
});

router.get('/addspottedpokemon', ensureLogin.ensureLoggedIn(), (req, res, next)=>{
  res.render('addspottedpokemon');
});

router.post('/addteam/:name', (req, res, next)=>{
  const name = req.params.name;
  const email = req.user.email;
  const team = req.user.team;
  const newTeam = [...team, name];
  const captured = req.user.captured;
  const capturedString = captured.join('-');
  if(team.length===6){
    Pokemon.find({trainer: email}, {name: 1, number: 1, _id: 0})
        .then((result)=>{
          res.render('pokedex', {errorMessage: 'You already have 6 pokemon in your team. Remove some of them before you add new ones.', string: capturedString, result});
        });
    return;
  }
  const newCaptured = [...captured, name];
  const newString = newCaptured.join('-');
  if(team.includes(name)){
    console.log('This pokemon is already in your team!');
    Pokemon.find({trainer: email}, {name: 1, number: 1, _id: 0})
        .then((result)=>{
          res.render('pokedex', {string: newString, result});
        });
    return;
  }
  if(!captured.includes(name)){
    Trainer.updateOne({email}, {captured: newCaptured})
    .then(()=>{
      console.log(`You just captured ${name}!`);
      Pokemon.find({trainer: email}, {name: 1, number: 1, _id: 0})
        .then((result)=>{
          res.render('pokedex', {string: newString, result});
        });
    })
    .catch((err)=>{
      console.log(err);
    });    
  }
  Trainer.updateOne({email}, {team: newTeam})
    .then(()=>{
      console.log(`Added ${name} to you team!`);
      res.render('pokedex', {string: newString});
    })
    .catch((err)=>{
      console.log(err);
    });
});

router.post('/capture/:name', (req, res, next)=>{
  const name = req.params.name;
  const email = req.user.email;
  const captured = req.user.captured;
  const newCaptured = [...captured, name];
  const newString = newCaptured.join('-');
  if(captured.includes(name)){
    console.log('This pokemon is already captured!');
    Pokemon.find({trainer: email}, {name: 1, number: 1, _id: 0})
        .then((result)=>{
          res.render('pokedex', {string: newString, result});
        });
    return;
  }  
  Trainer.updateOne({email}, {captured: newCaptured})
    .then(()=>{
      console.log(`You just captured ${name}!`);
      Pokemon.find({trainer: email}, {name: 1, number: 1, _id: 0})
        .then((result)=>{
          res.render('pokedex', {string: newString, result});
        });
    })
    .catch((err)=>{
      console.log(err);
    });
});

router.post('/remove/:name', (req, res, next)=>{
  const name = req.params.name;
  const email = req.user.email;
  const team = req.user.team;
  team.splice(team.indexOf(name), 1);
  Trainer.updateOne({email}, {team: team})
    .then(()=>{
      console.log(`${name} just got out of your team!`);
      res.redirect('/team');
    })
    .catch((err)=>{
      console.log(err);
    });
});

router.post('/addspottedpokemon', (req, res, next)=>{
  const {number, name, weight, height, type, captured} = req.body;
  const userCaptured = req.user.captured;
  const newString = userCaptured.join('-');
  const email = req.user.email;
  Pokemon.create({number, name, weight, height, type, captured, trainer: email})
    .then(()=>{
      console.log(`Ỳou added ${name} to the Pokédex. Thank you!`);
      Pokemon.find({trainer: email}, {name: 1, number: 1, number: 1, _id: 0})
        .then((result)=>{
          res.render('pokedex', {string: newString, result});
        });
    })
    .catch((err)=>{
      console.log(err);
    });

});

module.exports = router;
  
