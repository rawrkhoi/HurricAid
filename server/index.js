const config = require('../config');
const passport = require('passport');
const bcrypt = require('bcrypt');
const express = require('express');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');
const session = require('express-session');
const fallback = require('express-history-api-fallback');
const http = require('http');
const port = process.env.port || 3000;
const twilio = require('twilio');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const client = new twilio(config.config.accountSid, config.config.authToken);
const app = express();

app.use(express.static(`${__dirname}/../dist/browser`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser())

// PassPort=============================

// Session Setup============================
app.use(session({
  secret: 'supersecretsesh',
  saveUninitialized: true,
  resave: true,
  email: null,
  cookie: {
    path: '/',
  },
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('dist/browser'))

// Setup================================
passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password'}, (email, password, done) => {
  db.credential.findOne({ where: { email: email }, raw:true }, (error) => {
    console.log(error);
  })
  .then((cred) => {
    if (!cred) {
      return done(null, false, {
        message: 'Incorrect email.'
      });
    } else if (bcrypt.compareSync(password, cred.password) === false) {
      return done(null, false, {
        message: 'Incorrect password.'
      });
    } else {
      return done(null, cred);
    }
  });
}));

passport.serializeUser((cred, done) => {
  done(null, cred.id);
});

passport.deserializeUser((function (id, done) {
  db.credential.findOne({ where: { id: id }, raw:true }, (error) => {
    console.log(error);
  }).then((cred) => {
    done(null, cred);
  }).catch((error) => {
    done(error, false);
  }); 
}));

// SignUp=======================================Works
app.post('/signup', (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  var generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };
  var cryptPassword = generateHash(password);
  db.credential.create({
    email: email,
    password: cryptPassword,
  }, (error) => {
    console.log('error creating credential: ', error);
    res.status(500).send(error);
  }).then(() => {
    db.phone.create({
      number: phone
    }, (error) => {
      console.log('error creating phone: ', error);
      res.status(500).send(error);
    }).then(() => {
      db.phone.findOne({ where: { number: phone }, raw: true }, (error) => {
        console.log('error finding phone: ', error);
        res.status(500).send(error);
      }).then((ph) => {
        db.credential.findOne({ where: { email: email }, raw: true }, (error) => {
          console.log('error finding credential: ', error);
          res.status(500).send(error);
        }).then((cred) => {
          db.user.create({
            name_first: firstName,
            name_last: lastName,
            id_credential: cred.id,
            id_phone: ph.id,
          }, (error) => {
            console.log('error creating user: ', error);
            res.status(500).send(error);
          }).then(() => {
            db.user.findOne({ where: { id_credential: cred.id }, raw: true }, (error) => {
              console.log('error finding user: ', error);
              res.status(500).send(error);
            }).then((user) => {
              console.log('user created: ', user);
              res.status(201).send(user);
            });
          });
        });
      });
    });
  });
});


// Login========================================
app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, cred) => {
    if(err){ return next(err); }
    if(!cred){
      res.writeHead(401, {
        'Content-Type': 'application/json'
      });
    }
    req.logIn(cred, (err) => {
      if(err){
        return next(err);
      }
      return req.session.regenerate(() =>{
        req.session.cred = cred.email;
        req.session.credId = cred.id;
        res.send('true');
      })
    })
  })(req, res, next);
});
// =====================================

app.post('/addPin', (req, res) => {
  let { help, have, message, address, lat, lng, supply } = req.body.pin;
  db.pin.create({
    help: help,
    have: have,
    message: message,
    address: address, 
    latitude: lat,
    longitude: lng,
  }, (error) => {
    console.log('error creating pin: ', error);
    res.status(500).send(error);
  }).then(() => {
    db.pin.findOne({ where: { address: address }, raw:true }, 
      (error) => {
        console.log('error finding pin: ', error);
        res.status(500).send(error);
      }).then((pin) => {
      if (pin.have === true){
        supply.forEach((sup) => {
          db.supply_info.create({
            id_supply: sup,
            id_pin: pin.id,
          }, (error) => {
            console.log('error adding supply info: ', error);
            res.status(500).send(error);
          });
        });
      }
      console.log('pin created', pin);
      res.status(201).send(pin);
    }, (error) => {
      console.log('error finding pin: ', error);
      res.status(500).send(error);
    }); 
  }); 
}); 

app.get('/getPins', (req, res) => {
  db.pin.findAll().then((pins) => {
    res.status(200).send(pins);
  }, (error) => {
    console.log('error finding all pins: ', error);
    res.status(500).send(error);
  });
});

app.get('/getSupplies', (req, res) => {
  db.supply.findAll().then((supplies) => {
    res.status(200).send(supplies);
  }, (error) => {
    console.log('error finding all supplies: ', error);
    res.status(500).send(error);
  });
});

// app.post('/sms', (req, res) => {
//   const twiml = new MessagingResponse();
//   let textObj = {};
//   const smsCount = req.session.counter || 0;
//   req.session.command = '';
  
//   // OPTIONS //
//   if (req.body.Body.slice(0, 7).toLowerCase() === 'options') {
//     twiml.message("Try one of these commands: 'help@[address]', 'have@[address]', or 'need@[address]'");

//     // HELP //
//   } else if (req.body.Body.replace("'", "").slice(0, 5).toLowerCase() === 'help@') {
//     req.session.command = 'help';
//     if (!req.session.counter){
//       req.session.counter = smsCount;
//     } 
//     textObj.number = req.body.From.slice(1);
//     textObj.address = req.body.Body.slice(5);
//     twiml.message('SOS marker created. You may now send a brief message with details (optional).')
//       // they send a message back. we add to db and we send one back to them
//       db.sequelize.query(`SELECT number from phones where number='${textObj.number}'`).then((num) => {
//         if (num[0].length === 0){
//           db.sequelize.query(`INSERT INTO phones (number) values ('${textObj.number}')`);
//         } 
//         db.sequelize.query(`INSERT INTO help_pins (id_phone, address) values ((select id from phones where number='${textObj.number}'), '${textObj.address}')`);
//       });
//     }); 
//   }); 
// });

// for page refresh
app.use(fallback('index.html', {root: './dist/browser'}));

http.createServer(app).listen(port, () => console.log(`Express server listening on port ${port}!`));