const config = require('../config')
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
  db.sequelize.query(`SELECT * FROM credentials WHERE email = '${email}'`)
  .then((cred) => {
    if (!cred) {
      return done(null, false, {
        message: 'Incorrect email.'
      });
    } else if (bcrypt.compareSync(password, cred[0][0].password) === 'false') {
      return done(null, false, {
        message: 'Incorrect password.'
      });
    } else {
      return done(null, cred[0][0]);
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
    if(err){
      return next(err);
    }
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
  let { help, have, message, address, lat, lng, description } = req.body.pin;
  if (have === true) {
    db.pin.create({
      help: help,
      have: have,
      message: message,
      address: address,
      latitude: lat,
      longitude: lng,
    }, (error) => {
      console.log('error creating pin', error);
      res.status(500).send(error);
    }).then(() => {
      db.pin.find({ where: { address: address } }).then((pin) => {
        console.log('help pin created', pin.dataValues);
        res.status(201).send(pin.dataValues);
      }, (error) => {
        console.log('error finding pin', error);
        res.status(500).send(error);
      });
    });
  }
  if (help === true) {
    db.pin.create({
      help: help,
      have: have,
      message: message,
      address: address,
      latitude: lat,
      longitude: lng,
    }, (error) => {
      console.log('error creating pin', error);
      res.status(500).send(error);
    }).then(() => {
      db.pin.find({ where: { address: address } }).then((pin) => {
        console.log('help pin created', pin.dataValues);
        res.status(201).send(pin.dataValues);
      }, (error) => {
        console.log('error finding pin', error);
        res.status(500).send(error);
      });
    });
  }
});

app.get('/getPins', (req, res) => {
  db.pin.findAll().then((pins) => {
    res.status(201).send(pins);
  }, (error) => {
    console.log('error finding all pins', error);
    res.status(500).send(error);
  });
});

app.get('/getSupplies', (req, res) => {
  db.supply.findAll().then((supplies) => {
    res.status(200).send(supplies);
  }, (error) => {
    console.log('error finding supplies: ', error);
    res.status(500).send(error);
  });
});

app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  let textObj = {};
  const smsCount = req.session.counter || 0;
  req.session.command = '';
  
  // OPTIONS //
  if (req.body.Body.slice(0, 7).toLowerCase() === 'options') {
    twiml.message("Try one of these commands: 'help@[address]', 'have@[address]', or 'need@[address]'");

    // HELP //
  } else if (req.body.Body.replace("'", "").slice(0, 5).toLowerCase() === 'help@') {
    req.session.command = 'help';
    if (!req.session.counter){
      req.session.counter = smsCount;
    } 
    textObj.number = req.body.From.slice(1);
    textObj.address = req.body.Body.slice(5);
    twiml.message('SOS marker created. You may now send a brief message with details (optional).')
      // they send a message back. we add to db and we send one back to them
      db.sequelize.query(`SELECT number from phones where number='${textObj.number}'`).then((num) => {
        if (num[0].length === 0){
          db.sequelize.query(`INSERT INTO phones (number) values ('${textObj.number}')`);
        } 
        db.sequelize.query(`INSERT INTO help_pins (id_phone, address) values ((select id from phones where number='${textObj.number}'), '${textObj.address}')`);
      });
      req.session.counter = smsCount + 1;

    // HAVE //
  } else if (req.body.Body.replace("'", "").slice(0, 5).toLowerCase() === 'have@') {
    req.session.command = 'have';
    if (!req.session.counter) {
      req.session.counter = smsCount;
    }
    textObj.number = req.body.From.slice(1);
    textObj.address = req.body.Body.slice(5);
    req.session.address = textObj.address;
    twiml.message('What would you like to offer? Text 1 for Food, 2 for Water, 3 for Shelter, 4 for Other');
    db.sequelize.query(`SELECT number from phones where number='${textObj.number}'`).then((num) => {
      if (num[0].length === 0) {
        db.sequelize.query(`INSERT INTO phones (number) values ('${textObj.number}')`);
      }
      db.sequelize.query(`select id from have_pins where id_phone=(
        select id from phones where number='${textObj.number}'
        ) and address='${textObj.address}'`).then((id) => {
        console.log('id!!!!!!!!!!!!!!!', id);
        if (id[0].length === 0){
          db.sequelize.query(`INSERT INTO have_pins (id_phone, address) values ((select id from phones where number='${textObj.number}'), '${textObj.address}')`);
        } else {
          console.log('THERE IS ALREADY AN ID');
        }
      })
    });
    req.session.counter = smsCount + 1;

    // NEED //
  } else if (req.body.Body.replace("'", "").slice(0, 5).toLowerCase() === 'need@') {
    req.session.command = "need";
    if (!req.session.counter) {
      req.session.counter = smsCount;
    }
    textObj.number = req.body.From.slice(1);
    textObj.address = req.body.Body.slice(5);
    req.session.address = textObj.address;
    twiml.message('What do you need? Text 1 for Food, 2 for Water, 3 for Shelter');
    // send back a message with 3 closest places who have that
    req.session.counter = smsCount + 1;


    // OUT //
  } else if (req.body.Body.replace("'", "").slice(0, 4).toLowerCase() === 'out@') {
    textObj.number = req.body.From.slice(1);
    textObj.address = req.body.Body.slice(5);
    console.log(textObj);
    twiml.message('What are you out of? Text 1 for Food, 2 for Water, 3 for Shelter, 4 for Other');
    // they let us know what they're out of and we remove from db

    // SECOND MESSAGES AND INCORRECT MESSAGE GOES HERE //
  } else {
    let regexp = /[A-Z]/gi;
    let test;
    if (req.session.counter > 0) {
      textObj.message = req.body.Body;
      textObj.number = req.body.From.slice(1);
      let split = textObj.message.split('');
      if (req.session.command === 'have') {
        if (!textObj.message.match(regexp)) {
          db.phone.findOne({
            where: {
              number: textObj.number,
            },
            raw: true,
          }).then((phone) => {
            const phoneId = phone.id;
            const updateSupplies = (supply) => db.have_pins.update({ [supply]: true }, {
              where: {
                id_phone: phoneId,
                address: req.session.address,
              }
            })
            if (split.includes('1')){
              updateSupplies('food');
              twiml.message("Added pin. To remove a pin, type out@[address]");
            } 
            if (split.includes('2')) {
              updateSupplies('water');
              twiml.message("Added pin. To remove a pin, type out@[address]");
            } 
            if (split.includes('3')) {
              updateSupplies('shelter');
              twiml.message("Added pin. To remove a pin, type out@[address]");
            } 
            if (split.includes('4')) {
              updateSupplies('other');
              twiml.message("Ok, send message with what you want to offer");
              // do a query with a .then that will match the id_phone for the phone number
              db.sequelize.query(`SELECT id from have_pins where other = 'true' and id_phone = (select id from phones where number='${textObj.number}')`).then(([pinNum]) => {
                // console.log(num[0][0].number);
                // console.log(pinNum[0].id, 'PIN ID MF');
                test=pinNum[0].id;
                req.session.id = test;
              });
            }
          }) 
        } 
        else if (req.session.id !== undefined) {
          console.log('TEST IS TRUE');
          db.sequelize.query(`UPDATE have_pins SET other = '${textObj.message}' from phones where phones.number = '${textObj.number}' and have_pins.id_phone = (select id from phones where number='${textObj.number}')`);
          // else if other is true on the have pins table for that phone number
          // update other to a new message
          test = false;
        } 
      } else if (req.session.command === 'need') {
        textObj.message = req.body.Body;
        textObj.number = req.body.From.slice(1);
        let split = textObj.message.split('');
        if (!textObj.message.match(regexp)) {
          let findSupplies = (supply) =>  db.have_pins.findAll({
            where: {
              [supply]: true,
            },
            raw: true,
          });
          if (split.includes('5')) {
              findSupplies('food').then((entries) => {
                console.log(entries, 'THESE ARE THE ENTRIES');
                console.log(req.body, 'REQUEST body FOR TWIML MESSAGE')
                twiml.message("YOU DID IT GIRL");
              })
            }
            // if (split.includes('2')) {
            //   findSupplies('water');
            //   twiml.message();
            // }
            // if (split.includes('3')) {
            //   findSupplies('shelter');
            //   twiml.message();
            // }
        }
      } else {
            console.log(textObj, 'SECOND MESSAGE oBJECT?????????')
            db.sequelize.query(`UPDATE help_pins SET message = '${req.body.Body}' from phones where phones.number = '${textObj.number}' and help_pins.id_phone = (select id from phones where number='${textObj.number}')`);
            twiml.message("Message added to marker.");
          }
          req.session.counter = smsCount + 1;
    } else {
      twiml.message("Error: We don\'t know what you mean. Please enter one of the following: \nHelp@[address], \nHave@[address], \nNeed@[address]")
    }
  }
  
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());
});

// for page refresh
app.use(fallback('index.html', {root: './dist/browser'}));

http.createServer(app).listen(port, () => console.log(`Express server listening on port ${port}!`));