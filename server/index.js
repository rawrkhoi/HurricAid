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
const fs = require('fs');
const NaturalLanguageUnderstandingV1 = require('watson-developer-cloud/natural-language-understanding/v1.js');
const googleMapsClient = require('@google/maps').createClient({
  key: config.keys.geocode,
  Promise: Promise
})
const nlu = new NaturalLanguageUnderstandingV1({
  iam_apikey: config.keys.watson,
  version: '2018-04-05',
  url: 'https://gateway-tok.watsonplatform.net/natural-language-understanding/api/'
});
const watsonCats = require('../watson/keywords');


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
        req.session.credId = cred.id;
        res.send('true');
      })
    })
  })(req, res, next);
});
// =====================================

app.post('/addPin', (req, res) => {
  let { help, have, message, address, lat, lng, supply } = req.body.pin;
  if(req.session.credId){
    db.user.findOne({ where: { id_credential: req.session.credId }, raw:true }, (error) => {
      console.log('error finding user: ', error);
      res.status(500).send(error);
    }).then((user) => {
      db.phone.findOne({ where: { id: user.id_phone }, raw:true }, (error) => {
        console.log('error finding phone: ', error);
        res.status(500).send(error);
      }).then((ph) => {
        db.pin.create({
          help: help,
          have: have,
          message: message,
          id_phone: ph.id,
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
    });
  }
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

app.get('/getInfo', (req, res) => {
  let credId = req.session.credId;
  if (credId){
    db.user.findOne({ where: { id_credential: credId }, raw:true }, (error) => {
      console.log('error finding user: ', error);
      res.status(500).send(error);
    }).then((user) => {
      db.phone.findOne({ where: { id: user.id_phone }, raw:true }, (error) => {
        console.log('error finding phone: ', error);
        res.status(500).send(error);
      }).then((ph) => {
        db.credential.findOne({ where: { id: user.id_credential }, raw:true }, (error) => {
          console.log('error finding cred: ', error);
          res.status(500).send(error);
        }).then((cred) => {
          let info = {
            usr: user,
            email: cred.email,
            phoneNum: ph.number,
          }
          res.status(200).send(info);
        });
      });
    });
  } else {
    res.send();
  }
}); 

app.post('/updateInfo', (req, res) => {
  let { firstName, lastName, email, phone, password, current } = req.body;
  console.log(password, 'password');
  console.log(current, 'current');
  if(firstName){
    db.user.update({ name_first: firstName }, { where: { id_credential: req.session.credId } }).then(() => {
      console.log('first name updated');
    });
  }
  if(lastName){
    db.user.update({ name_last: lastName }, {  where: { id_credential: req.session.credId } }).then(() => {
      console.log('last name updated');
    });
  }
  if(email){
    db.credential.update({ email: email }, {  where: { id: req.session.credId } }).then(() => {
      console.log('email updated');
    });
  }
  if(phone){
    db.user.findOne({ where: { id_credential: req.session.credId }, raw:true }, (error) => {
      console.log('error finding user: ', error);
      res.status(500).send(error);
    }).then((user) => {
      db.phone.update({ number: phone}, { where: { id: user.id_phone } }).then(() => {
        console.log('phone number updated');
      });
    });
  }
  if(password && current){
    db.credential.findOne({ where: { id: req.session.credId }, raw:true }, (error) => {
      console.log('error finding cred: ', error);
      res.status(500).send(error);
    }).then((cred) => {
      if (bcrypt.compareSync(current, cred.password) === true) {
        console.log('here');
        var generateHash = function (pws) {
          return bcrypt.hashSync(pws, bcrypt.genSaltSync(8), null);
        };
        var cryptPassword = generateHash(password);
        db.credential.update({ password: cryptPassword }, { where: { id: req.session.credId } }, (error) => {
          console.log('error updating password: ', error);
          res.status(500).send(error);
        }).then(() => {
          console.log('password updated');
        });
      }
    });
  }
});

app.get('/getPinsByUser', (req, res) => {
  db.user.findOne({ where: { id_credential: req.session.credId }, raw:true }, (error) => {
    console.log('error finding user: ', error); 
    res.status(500).send(error);
  }).then((user) => {
      db.pin.findAll({ where: { id_phone: user.id_phone }, raw:true }, (error) => {
        console.log('error finding pins: ', error);
        res.status(500).send(error);
      }).then((userPins) => {
        res.status(200).send(userPins);
      });
    });
});

app.post('/removePin', (req, res) => {
  const { pinId } = req.body;
  db.supply_info.destroy({ where: { id_pin: pinId } }, (error) => {
    console.log('error removing pin from supply infos table: ', error);
    res.status(500).send(error);
  }).then(() => {
    db.pin.destroy({ where: { id: pinId } }, (error) => {
      console.log('error removing pin from pins table: ', error);
      res.status(500).send(error);
    }).then(() => {
      console.log('pin removed');
    });
  });
});

app.get('/filterPinsBySupply', (req, res) => {
  const { supplyId } = req.body;
  db.supply_info.findAll({ where: { id_supply: supplyId }, raw:true }, (error) => {
    console.log('error finding supply: ', error);
    res.status(500).send(error);
  }).then((supplyPins) => {
    let pinArr = [];
      supplyPins.forEach((sup) => {
        db.pin.findOne({ where: { id: sup.id_pin }, raw:true }, (error) => {
          console.log('error finding pin: ', error);
          res.status(500).send(error);
        }).then((pin) => {
          pinArr.push(pin);
        });
      });
      setTimeout(() => {
        res.send(pinArr);
      }, 1000);
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.send();
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
      body: "Try one of these commands: \nHelp@Your-Address, \nHave@Your-Address, \nNeed@Your-Address",
    }).catch(err => console.error(err))
    
    // HELP //
  } else if (req.body.Body.replace(' ', '').replace("'", "").slice(0, 5).toLowerCase() === 'help@' || req.body.Body.replace(' ', '').replace("'", "").slice(0, 6).toLowerCase() === 'helpat') {
    req.session.command = 'help';
    textObj.address = req.body.Body.slice(5);
    if (!req.session.counter){
      req.session.counter = smsCount;
    } 
    return client.messages.create({
      from: '15043020292',
      to: textObj.number,
      body: 'SOS marker created. You may now add a message with any details (optional).',
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
      res.send('done');
    }).catch(err => console.error(err))

    // HAVE //
  } else if (req.body.Body.replace(' ', '').replace("'", "").slice(0, 5).toLowerCase() === 'have@' || req.body.Body.replace(' ', '').replace("'", "").slice(0, 6).toLowerCase() === 'haveat') {
    req.session.command = 'have';
    textObj.address = req.body.Body.slice(5);
    if (!req.session.counter) {
      req.session.counter = smsCount;
    }
    return client.messages.create({
      from: '15043020292',
      to: textObj.number,
      body: 'What would you like to offer? Ex: "I have plenty of bread to offer."',
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
    }).then((pin) => {
      req.session.pinId = pin.id;
      req.session.counter = smsCount + 1;
      res.send('done');
    }).catch(err => console.error(err))
    

    // NEED //
  } else if (req.body.Body.replace(' ', '').replace("'", "").slice(0, 5).toLowerCase() === 'need@' || req.body.Body.replace(' ', '').replace("'", "").slice(0, 6).toLowerCase() === 'needat') {
    req.session.command = "need";
    textObj.address = req.body.Body.slice(5);
    if (!req.session.counter) {
      req.session.counter = smsCount;
    }
    return client.messages.create({
      from: '15043020292',
      to: textObj.number,
      body: 'What do you need? Ex: "I need shelter for the night".',
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
  } else if (req.body.Body.replace(' ', '').replace("'", "").slice(0, 4).toLowerCase() === 'out@' || req.body.Body.replace(' ', '').replace("'", "").slice(0, 5).toLowerCase() === 'outat') {
    req.session.command = "out";
    textObj.address = req.body.Body.slice(4);
    if (!req.session.counter) {
      req.session.counter = smsCount;
    }
    return client.messages.create({
      from: '15043020292',
      to: textObj.number,
      body: 'What are you out of? Ex: "I am out of bread."',
    }).then(() => {
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
      
      let supplyStr = '';
      let analyzeCat = () => {
        if (textObj.message.split(' ').length > 3){
          return new Promise ((res, rej) => {
            nlu.analyze(
              {
                text: textObj.message,
                features: {
                  categories: {}
                }
              },
              function (err, response) {
                let catStr = '';
                if (err) {
                  console.error(err);
                } else {
                  console.log(response);
                  response.categories.map((result) => {
                    catStr += result.label;
                  });
                  Object.values(watsonCats.watsonCategories).forEach((category) => {
                    category.keywords.forEach((keyword) => {
                      if (catStr.includes(keyword)){
                        supplyStr = category.table;
                      }
                    })
                  })
                  res(supplyStr);
                }
              }
            );
          })
        } else {
          return new Promise ((res, rej) => {
            let splitArr = textObj.message.split(' ');
            splitArr.forEach((word) => {
              supplyStr += word;
            })
            res(supplyStr);
          })
        }
      }

      if (req.session.command === 'have') {
        let addHaves = (supply) => {
          db.supply.findOne({
            attributes: ['id'],
            where: {
              type: supply,
            },
            raw: true
          }).then((supplyId) => {
              return db.supply_info.create({
                id_supply: supplyId.id,
                id_pin: req.session.pinId,
              }).then(() => {
                return db.pin.update({ message: req.body.Body },
                  {
                    where: {
                      id: req.session.pinId,
                      have: true,
                      address: req.session.address,
                    }
                  })
              }).then(() => {
                return client.messages.create({
                  from: '15043020292',
                  to: textObj.number,
                  body: 'Thank you! Your offering has been added to the map. Please type "Out@Your-Address" if you run out of this offering.',
                })
              }).then(() => {
              req.session.pinId = null;
            }).catch((err) => {
              console.error(err);
              // this is meant to send to a user if they type less than 3 words, but it is not working
              // return client.messages.create({
              //   from: '15043020292',
              //   to: textObj.number,
              //   body: 'We didn\'t understand your text message. Please describe your offering in 3 words.',
              // })
            })
          })
        }
        analyzeCat().then((tableName) => {
          if (tableName === "Water" || tableName.toLowerCase().includes('water')){
            addHaves('Water');
          }
          if (tableName === "Food" || tableName.toLowerCase().includes('food')){
            addHaves('Food');
          }
          if (tableName === "Shelter" || tableName.toLowerCase().includes('shelter')) {
            addHaves('Shelter');
          }
          if (tableName === "Equipment"){
            addHaves('Equipment');
          }
          if (tableName === "Clothing" || tableName.toLowerCase().includes('clothing') || tableName.toLowerCase().includes('clothes')) {
            addHaves('Clothing');
          }
          if (tableName === "Power" || tableName.toLowerCase().includes('power' || tableName.toLowerCase().includes('electricity'))) {
            addHaves('Power');
          }
          if (tableName === "Pet") {
            addHaves('Pet');
          }
          if (tableName === "Transportation") {
            addHaves('Transportation');
          }
          if (tableName === "Health") {
            addHaves('Health');
          }
          if (tableName === "Household") {
            addHaves('Household');
          } 
          else if (!tableName){
            addHaves('Other');
          }
        })
      } else if (req.session.command === 'need'){


        let needSupply = (supply) => {
          let addressString = '';
          let pushTo = (addressVal, msgVal) => {
            return addressString = addressString + ' * ' + addressVal + ': ' + msgVal;
          }
          db.supply.findOne({
            attributes: ['id'],
            where: {
              type: supply,
            },
            raw: true
          }).then((supplyid) => {
            db.supply_info.findAll({
              attributes: ['id_pin'],
              where: {
                id_supply: supplyid.id,
              },
              raw: true,
            }).then((pinIdArray) => {
              pinIdArray.map((pinId) => {
                let findDistance = (needCoords, haveCoords) => {

                }
                db.pin.findOne({ where: { id: pinId.id_pin }, raw: true }).then((pin) => {
                  pushTo(pin.address, pin.message);
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
          })
        }
        analyzeCat().then((tableName) => {
          if (tableName === 'Water' || tableName.toLowerCase().includes('water')) {
            needSupply('Water');
          }
          if (tableName === "Food" || tableName.toLowerCase().includes('food')) {
            needSupply('Food');
          }
          if (tableName === "Shelter" || tableName.toLowerCase().includes('shelter')) {
            needSupply('Shelter');
          }
          if (tableName === "Equipment") {
            needSupply('Equipment');
          }
          if (tableName === "Clothing" || tableName.toLowerCase().includes('clothing') || tableName.toLowerCase().includes('clothes')) {
            needSupply('Clothing');
          }
          if (tableName === "Power" || tableName.toLowerCase().includes('power') || tableName.toLowerCase().includes('electricity')) {
            needSupply('Power');
          }
          if (tableName === "Pet") {
            needSupply('Pet');
          }
          if (tableName === "Transportation") {
            needSupply('Transportation');
          }
          if (tableName === "Health") {
            needSupply('Health');
          }
          if (tableName === "Household") {
            needSupply('Household');
          }
          else if (!tableName) {
            needSupply('Other');
          }
        })

      } else if (req.session.command === 'out'){  
        let outFunc = (supply) => {
          return db.supply.findOne({
            attributes: ['id'],
            where: {
              type: supply,
            },
            raw: true,
          }).then((supplyId) => {
            return db.pin.findAll({ attributes: ['id'], where: { have: true, address: req.session.address }, raw: true })
              .then((pins) => {
                return Promise.all(pins.map((pin) => {
                  return db.supply_info.findOne({
                    attributes: ['id', 'id_pin'],
                    where: {
                      id_supply: supplyId.id,
                      id_pin: pin.id,
                    },
                    raw: true,
                  })
              }))
              .then((supplyInfoIds) => {
                return supplyInfoIds.filter((id) => {
                  return id !== null;
                })[0]
              })
              .then((supplyInfo) => {
                return db.supply_info.destroy({
                  where: {
                    id: supplyInfo.id,
                  }
                }).then(() => {
                  return supplyInfo.id_pin;
                })
              })
              .then((pinId) => {
                  return db.pin.destroy({
                    where: {
                      id: pinId,
                      have: true,
                    }
                  })
              })
            })
            .then(() => {
              return client.messages.create({
                from: '15043020292',
                to: textObj.number,
                body: 'Thank you. Your offering has been removed from the map.',
              })
            }).catch(err => console.error(err))
          })
        }
        analyzeCat().then((tableName) => {
          if (tableName === 'Water' || tableName.toLowerCase().includes('water')){
            outFunc('Water');
          }
          if (tableName === "Food" || tableName.toLowerCase().includes('food')) {
            outFunc('Food');
          }
          if (tableName === "Shelter" || tableName.toLowerCase().includes('shelter')) {
            outFunc('Shelter');
          }
          if (tableName === "Equipment") {
            outFunc('Equipment');
          }
          if (tableName === "Clothing" || tableName.toLowerCase().includes('clothing' || tableName.toLowerCase().includes('clothes'))) {
            outFunc('Clothing');
          }
          if (tableName === "Power" || tableName.toLowerCase().includes('power') || tableName.toLowerCase().includes('electricity')) {
            outFunc('Power');
          }
          if (tableName === "Pet") {
            outFunc('Pet');
          }
          if (tableName === "Transportation") {
            outFunc('Transportation');
          }
          if (tableName === "Health") {
            outFunc('Health');
          }
          if (tableName === "Household") {
            outFunc('Household');
          }
          else if (!tableName) {
            outFunc('Other');
          }
        })
          
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
              body: 'Thank you, your message has been added to the marker.',
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
        body: 'Error: We don\'t know what you mean. Please enter one of the following: \nHelp@Your-Address, \nHave@Your-Address, \nNeed@Your-Address',
      }).then(() => {
        res.send('done');
      }).catch(err => console.error(err))
    }
  
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end();

}
});

// for page refresh
app.use(fallback('index.html', {root: './dist/browser'}));

http.createServer(app).listen(port, () => console.log(`Express server listening on port ${port}!`));