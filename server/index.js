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
// const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const client = new twilio(config.config.accountSid, config.config.authToken);
const googleMapsClient = require('@google/maps').createClient({
  key: config.keys.geocode,
  Promise: Promise
})
const app = express();

app.use(express.static(`${__dirname}/../dist/browser`));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

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
app.use(express.static('dist/browser'));

// Setup================================
passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password'}, (email, password, done) => {
  db.credential.findOne({ where: { email: email }, raw:true }, (error) => {
    console.log(error);
  }).then((cred) => {
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
  }).catch((error) => {
    console.log('error finding pins: ', error);
    res.status(500).send(error);
  });
});

app.get('/getSupplies', (req, res) => {
  db.supply.findAll().then((supplies) => {
    res.status(200).send(supplies);
  }).catch((error) => {
    console.log('error finding supplies: ', error);
    res.status(500).send(error);
  });
});

app.post('/sms', (req, res) => {
  let textObj = {};
  const smsCount = req.session.counter || 0;
  textObj.number = req.body.From.slice(1);
  // OPTIONS //
  if (req.body.Body.slice(0, 7).toLowerCase() === 'options') {
    return client.messages.create({
      from: '15043020292',
      to: textObj.number,
      body: "Try one of these commands: \nHelp@[address], \nHave@[address], \nNeed@[address]",
    }).catch(err => console.error(err))
    
    // HELP //
  } else if (req.body.Body.replace("'", "").slice(0, 5).toLowerCase() === 'help@') {
    req.session.command = 'help';
    textObj.address = req.body.Body.slice(5);
    if (!req.session.counter){
      req.session.counter = smsCount;
    } 
    return client.messages.create({
      from: '15043020292',
      to: textObj.number,
      body: 'SOS marker created. You may now send a brief message with details (optional).',
    }).then(() => {
      return db.phone.findOne({
        where: {
          number: textObj.number
        },
        raw: true,
      })
    }).then((num) => {
      if (!num) {
        return db.phone.create({
          number: textObj.number
        });
      }
    }).then(() => {
      return db.phone.find({ where: { number: textObj.number } });
    }).then((phone) => {
      return googleMapsClient.geocode({
        address: textObj.address
      }).asPromise().then((response) => {
        return {
          response,
          phone,
        };
      });
    }).then(({ response, phone }) => {
      const resultObj = response.json.results[0];
      const latitude = resultObj.geometry.location.lat;
      const longitude = resultObj.geometry.location.lng;
      const formatAddress = resultObj.formatted_address;
      req.session.address = formatAddress;
      return db.pin.create({
        help: true,
        id_phone: phone.dataValues.id,
        address: formatAddress,
        latitude: latitude,
        longitude: longitude,
      })
    }).then(() => {
      req.session.counter = smsCount + 1;
      console.log(req.session, 'REQUEST SESSION, LOOK FOR command AND COUNTER');
      res.send('done');
    }).catch(err => console.error(err))

    // HAVE //
  } else if (req.body.Body.replace("'", "").slice(0, 5).toLowerCase() === 'have@') {
    req.session.command = 'have';
    textObj.address = req.body.Body.slice(5);
    if (!req.session.counter) {
      req.session.counter = smsCount;
    }
    return client.messages.create({
      from: '15043020292',
      to: textObj.number,
      body: 'What would you like to offer? Text Food, Water, or Shelter and details',
    }).then(() => {
      return db.phone.findOne({
        where: { number: textObj.number },
        raw: true,
      })
    }).then((num) => {
      if (!num) {
        return db.phone.create({
          number: textObj.number
        });
      }
    }).then(() => {
      return db.phone.find({ where: { number: textObj.number } });
    }).then((phone) => {
      return googleMapsClient.geocode({
        address: textObj.address
        }).asPromise().then((response) => {
          return {
            response,
            phone,
          };
        });
    }).then(({ response, phone }) => {
      const resultObj = response.json.results[0];
      const latitude = resultObj.geometry.location.lat;
      const longitude = resultObj.geometry.location.lng;
      const formatAddress = resultObj.formatted_address;
      req.session.address = formatAddress;
      return db.pin.create({
        have: true,
        id_phone: phone.dataValues.id,
        address: formatAddress,
        latitude: latitude,
        longitude: longitude,
      }) 
    }).then(() => {
      req.session.counter = smsCount + 1;
      console.log(req.session, 'REQUEST SESSION, LOOK FOR COMMAND AND COUNTER');
      res.send('done');
    }).catch(err => console.error(err))
    

    // NEED //
  } else if (req.body.Body.replace("'", "").slice(0, 5).toLowerCase() === 'need@') {
    req.session.command = "need";
    textObj.address = req.body.Body.slice(5);
    if (!req.session.counter) {
      req.session.counter = smsCount;
    }
    return client.messages.create({
      from: '15043020292',
      to: textObj.number,
      body: 'What do you need? Text Food, Water, or Shelter',
    }).then(() => {
      return googleMapsClient.geocode({
        address: textObj.address
      }).asPromise().then((response) => {
        return response
      })
    }).then((response) => {
      const resultObj = response.json.results[0];
      formatAddress = resultObj.formatted_address;
      req.session.address = formatAddress;
    }).then(() => {
      req.session.counter = smsCount + 1;
      res.send('done');
    }).catch(err => console.error(err))

    // OUT //
  } else if (req.body.Body.replace("'", "").slice(0, 4).toLowerCase() === 'out@') {
    req.session.command = "out";
    textObj.address = req.body.Body.slice(4);
    if (!req.session.counter) {
      req.session.counter = smsCount;
    }
    return client.messages.create({
      from: '15043020292',
      to: textObj.number,
      body: 'What are you out of? Text Food, Water, or Shelter',
    }).then(() => {
      return db.phone.findOne({ where: { number: textObj.number }, raw: true});
    }).then((phone) => {
      return googleMapsClient.geocode({
        address: textObj.address
      }).asPromise().then((response) => {
        const resultObj = response.json.results[0];
        formatAddress = resultObj.formatted_address;
        req.session.address = formatAddress;
      });
    }).then(() => {
      req.session.counter = smsCount + 1;
      res.send('done');
    }).catch(err => console.error(err));

  } else {
    // SECOND MESSAGES AND INCORRECT MESSAGES GOES HERE //
    if (req.session.counter > 0) {
      textObj.message = req.body.Body;
      let split = textObj.message.toLowerCase().split(' ');
      if (req.session.command === 'have') {
        if (split.includes('water')) {
          return db.supply.findOne({
            attributes: ['id'],
            where: {
              type: 'Water',
            },
            raw: true
          }).then((supplyId) => {
            db.pin.findOne({ attributes: ['id'], where: { have: true, address: req.session.address }, raw: true }).then((pinId) => {
              return db.supply_info.create({
                id_supply: supplyId.id,
                id_pin: pinId.id,
              }).then(() => {
                return db.pin.update({ message: req.body.Body },
                  {where: {
                    id: `${pinId.id}`,
                    have: true,
                    address: req.session.address,
                    }
                  })
              })
            }).then(() => {
              return client.messages.create({
                from: '15043020292',
                to: textObj.number,
                body: 'Thank you! Your offering has been added to the map.',
              })
            }).catch((err) => {
              console.error(err);
            })
          })
        }
        if (split.includes('food')) {
          return db.supply.findOne({
            attributes: ['id'],
            where: {
              type: 'Food',
            },
            raw: true
          }).then((supplyId) => {
            return db.pin.findOne({ attributes: ['id'], where: { have: true, address: req.session.address }, raw: true }).then((pinId) => {
              return db.supply_info.create({
                id_supply: supplyId.id,
                id_pin: pinId.id,
              }).then(() => {
                return db.pin.update({ message: req.body.Body },
                  {
                    where: {
                      id: `${pinId.id}`,
                      have: true,
                      address: req.session.address,
                    }
                  })
              })
            }).then(() => {
              return client.messages.create({
                from: '15043020292',
                to: textObj.number,
                body: 'Thank you! Your offering has been added to the map.',
              })
            }).catch((err) => {
              console.error(err);
            })
          })
        } else if (split.includes('shelter')) {
          return db.supply.findOne({
            attributes: ['id'],
            where: {
              type: 'Shelter',
            },
            raw: true
          }).then((supplyId) => {
            return db.pin.findOne({ attributes: ['id'], where: { have: true, address: req.session.address }, raw: true }).then((pinId) => {
              return db.supply_info.create({
                id_supply: supplyId.id,
                id_pin: pinId.id,
              }).then(() => {
                return db.pin.update({ message: req.body.Body },
                  {
                    where: {
                      id: `${pinId.id}`,
                      have: true,
                      address: req.session.address,
                    }
                  })
              })
            }).then(() => {
              return client.messages.create({
                from: '15043020292',
                to: textObj.number,
                body: 'Thank you! Your offering has been added to the map.',
              })
            }).catch((err) => {
              console.error(err);
            })
          })
        }
      } else if (req.session.command === 'need'){
        if (split.includes('water')){
          let addressString = '';
          let pushTo = (val) => {
            return addressString = addressString + ' * ' + val;
          }
          db.supply_info.findAll({
            attributes: ['id_pin'],
            where: {
              id_supply: 1,
            },
            raw: true,
          }).then((pinIdArray) => {
            pinIdArray.map((pinId) => {
              db.pin.findOne({ where: { id: pinId.id_pin }, raw: true }).then((pin) => {
                pushTo(pin.address);
              })
            })
          }).then(() => {
            setTimeout(() => {
                return client.messages.create({
                  from: '15043020292',
                  to: textObj.number,
                  body: addressString,
                })
              }, 1000);
            })
            
        } else if (split.includes('food')){
          let addressString = '';
          let pushTo = (val) => {
            return addressString = addressString + ' * ' + val;
          }
          db.supply_info.findAll({
            attributes: ['id_pin'],
            where: {
              id_supply: 2,
            },
            raw: true,
          }).then((pinIdArray) => {
            pinIdArray.map((pinId) => {
              db.pin.findOne({ where: { id: pinId.id_pin }, raw: true }).then((pin) => {
                pushTo(pin.address);
              })
            })
          }).then(() => {
            setTimeout(() => {
              return client.messages.create({
                from: '15043020292',
                to: textObj.number,
                body: addressString,
              })
            }, 1000);
          })

        } else if (split.includes('shelter')){
          let addressString = '';
          let pushTo = (val) => {
            return addressString = addressString + ' * ' + val;
          }
          db.supply_info.findAll({
            attributes: ['id_pin'],
            where: {
              id_supply: 3,
            },
            raw: true,
          }).then((pinIdArray) => {
            pinIdArray.map((pinId) => {
              db.pin.findOne({ where: { id: pinId.id_pin }, raw: true }).then((pin) => {
                pushTo(pin.address);
              })
            })
          }).then(() => {
            setTimeout(() => {
              return client.messages.create({
                from: '15043020292',
                to: textObj.number,
                body: addressString,
              })
            }, 1000);
          })

        }

      } else if (req.session.command === 'out'){  
        let split = textObj.message.toLowerCase().split(' ');
        if (split.includes('water')){
          db.supply.findOne({
            attributes: ['id'],
            where: {
              type: "Water",
            },
            raw: true,
          }).then((supplyId) => {
            db.pin.findOne({ attributes: ['id'], where: { have: true, address: req.session.address }, raw: true }).then((pin) => {
              db.supply_info.destroy({
                where: {
                  id_pin: pin.id,
                  id_supply: supplyId.id,
                }
              }).then(() => {
                db.pin.destroy({
                  where: {
                    have: true,
                    address: req.session.address,
                    id: pin.id,
                  }
                })
              })
              }).then(() => {
                return client.messages.create({
                  from: '15043020292',
                  to: textObj.number,
                  body: 'Thank you. Your offering has been removed from the map.',
                })
              }).catch(err => console.error(err))
            })
        } else if (split.includes('food')) {
          db.supply.findOne({
            attributes: ['id'],
            where: {
              type: "Food",
            },
            raw: true,
          }).then((supplyId) => {
            db.pin.findOne({ attributes: ['id'], where: { have: true, address: req.session.address }, raw: true }).then((pin) => {
              db.supply_info.destroy({
                where: {
                  id_pin: pin.id,
                  id_supply: supplyId.id,
                }
              }).then(() => {
                db.pin.destroy({
                  where: {
                    have: true,
                    address: req.session.address,
                    id: pin.id,
                  }
                })
              })
            }).then(() => {
              return client.messages.create({
                from: '15043020292',
                to: textObj.number,
                body: 'Thank you. Your offering has been removed from the map.',
              })
            }).catch(err => console.error(err))
          })
        } else if (split.includes('shelter')) {
          db.supply.findOne({
            attributes: ['id'],
            where: {
              type: "Shelter",
            },
            raw: true,
          }).then((supplyId) => {
            db.pin.findOne({ attributes: ['id'], where: { have: true, address: req.session.address }, raw: true }).then((pin) => {
              db.supply_info.destroy({
                where: {
                  id_pin: pin.id,
                  id_supply: supplyId.id,
                }
              }).then(() => {
                db.pin.destroy({
                  where: {
                    have: true,
                    address: req.session.address,
                    id: pin.id,
                  }
                })
              })
            }).then(() => {
              return client.messages.create({
                from: '15043020292',
                to: textObj.number,
                body: 'Thank you. Your offering has been removed from the map.',
              })
            }).catch(err => console.error(err))
          })
        }
          
          
      } else if (req.session.command === 'help'){
          db.phone.findOne({
            attributes: ['id'],
            where: {
              number: textObj.number
            },
            raw: true,
          }).then((phoneId) => {
            db.pin.update({message: req.body.Body},
              {where: {
                id_phone: phoneId.id,
                help: true,
                address: req.session.address
              }}
            )
            console.log(req.session);
          }).then(() => {
            return client.messages.create({
              from: '15043020292',
              to: textObj.number,
              body: 'Message added to marker.',
            })
          })
          .then(() => {
            res.end();
          }).catch((e) => {
            console.error(e);
          })}
    } else {
      return client.messages.create({
        from: '15043020292',
        to: textObj.number,
        body: 'Error: We don\'t know what you mean. Please enter one of the following: \nHelp@[address], \nHave@[address], \nNeed@[address]',
      }).catch(err => console.error(err))
    }
  
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end();

}
});

app.get('/getInfo', (req, res) => {
  let credEmail = req.session.cred;
  let credId = req.session.credId;

  if (req.session.cred){
    db.user.findOne({ where: { id_credential: credId }, raw:true }, (error) => {
      console.log('error finding user: ', error);
      res.status(500).send(error);
    }).then((user) => {
      let info = {
        usr: user,
        email: credEmail
      }
      res.status(200).send(info);
    });
  } else {
    res.send();
  }
}); 

// for page refresh
app.use(fallback('index.html', {root: './dist/browser'}));

http.createServer(app).listen(port, () => console.log(`Express server listening on port ${port}!`));