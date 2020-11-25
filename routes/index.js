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
  Pokemon.find({trainerTeam: req.user.email})
    .then((result)=>{
      res.render('team', {result});
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
  Pokemon.find({trainer: email}, {name: 1, number: 1, _id: 0}, {sort: {number: 1}})
    .then((result)=>{
      res.render('pokedex', {string: newString, result});
    })
    .catch((err)=>{
      console.log(err);
    });
});

router.get('/captured', ensureLogin.ensureLoggedIn(), (req,res,next)=>{
  const email = req.user.email;
    Pokemon.find({trainerCapture: email})
      .then((result)=>{
        res.render('captured', {result});
      })
    .catch((err)=>{
      res.send(err);
    });
});

router.get('/pokemon/:number', ensureLogin.ensureLoggedIn(), (req,res,next)=>{
  res.render('pokemon');
});

router.get('/addspottedpokemon', ensureLogin.ensureLoggedIn(), (req, res, next)=>{
  res.render('addspottedpokemon');
});

router.post('/addteam/:name/:number', (req, res, next)=>{
  const number = req.params.number;
  const name = req.params.name;
  const email = req.user.email;
  const team = req.user.team;
  const newTeam = [...team, name];
  const captured = req.user.captured;
  const capturedString = captured.join('-');
  if(team.length===6){
    Pokemon.find({trainer: email}, {name: 1, number: 1, _id: 0}, {sort: {number: 1}})
        .then((result)=>{
          res.render('pokedex', {errorMessage: 'You already have 6 pokemon in your team. Remove some of them before you add new ones.', string: capturedString, result});
        });
    return;
  }
  const newCaptured = [...captured, name];
  const newString = newCaptured.join('-');
  if(team.includes(name)){
    console.log('This pokemon is already in your team!');
    Pokemon.find({trainer: email}, {name: 1, number: 1, _id: 0}, {sort: {number: 1}})
    .then((result)=>{
          res.render('pokedex', {errorMessage: `This Pokémon is already in your team, trainer!`, string: capturedString, result});
        });
    return;
  }
  if(!captured.includes(name)){
    Trainer.updateOne({email}, {captured: newCaptured})
    .then(()=>{
      console.log(`You just captured ${name}!`);
      Pokemon.create({name, number, trainerCapture: email})
        .then(()=>{
          console.log(`${name} created in DB!`);
        });
    })
    .catch((err)=>{
      console.log(err);
    });  
  }
  Trainer.updateOne({email}, {team: newTeam})
    .then(()=>{
      console.log(`You just add ${name} to your team!`);
      Pokemon.create({name, number, trainerTeam: email})
        .then(()=>{
          console.log(`${name} updated in DB!`)
          Pokemon.find({trainer: email}, {name: 1, number: 1, _id: 0}, {sort: {number: 1}})
            .then((result)=>{
              res.redirect('/team');
            });
        });
    })
    .catch((err)=>{
      console.log(err);
    });
});

router.post('/capture/:name/:number', (req, res, next)=>{
  const name = req.params.name;
  const number = Number(req.params.number);
  const email = req.user.email;
  const captured = req.user.captured;
  const newCaptured = [...captured, name];
  const newString = newCaptured.join('-');
  if(captured.includes(name)){
    console.log('This pokemon is already captured!');
    Pokemon.find({trainer: email}, {name: 1, number: 1, _id: 0}, {sort: {number: 1}})
    .then((result)=>{
          res.render('pokedex', {string: newString, result, errorMessage: 'This Pokémon is already captured!'});
        });
    return;
  }  
  Trainer.updateOne({email}, {captured: newCaptured})
    .then(()=>{
      console.log(`You just captured ${name}!`);
      Pokemon.create({name, number, trainerCapture: email})
        .then(()=>{
          console.log(`${name} created in DB!`)
          Pokemon.find({trainer: email}, {name: 1, number: 1, _id: 0}, {sort: {number: 1}})
            .then((result)=>{
              res.redirect('/captured');
            });
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
  Trainer.updateOne({email}, {team})
    .then(()=>{
      Pokemon.findOneAndDelete({trainerTeam: email, name})
        .then(()=>{
          console.log(`${name} just got out of your team!`);
          res.redirect('/team');
        });
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
  
  if(number===''){
    Pokemon.find({trainer: email}, {name: 1, number: 1, _id: 0}, {sort: {number: 1}})
        .then((result)=>{
          res.render('addspottedpokemon', {errorMessage: 'Number in Pokédex is required. Fill it please.'});
        });
        return;
  }
  Pokemon.create({number, name, weight, height, type, captured, trainer: email})
    .then(()=>{
      console.log(`Ỳou added ${name} to the Pokédex. Thank you!`);
      Pokemon.find({trainer: email}, {name: 1, number: 1, _id: 0}, {sort: {number: 1}})
        .then((result)=>{
          res.render('pokedex', {string: newString, result});
        });
    })
    .catch((err)=>{
      console.log(err);
    });

});

router.post('/delete/:name/:number', (req, res)=>{
  const name = req.params.name;
  const number = req.params.number;
  const email = req.user.email;
  const captured = req.user.captured;
  const newCaptured = [...captured, name];
  const newString = newCaptured.join('-');
  Pokemon.findOneAndDelete({trainer: email, number})
    .then(()=>{
      Pokemon.find({trainer: email}, {}, {sort: {number: 1}})
      .then((result)=>{
        res.render('pokedex', {string: newString, result});
        console.log(`${name} was deleted.`);
      });
    })
    .catch((err)=>{
      console.log(err);
    });
});

module.exports = router;
  
