const config = require('../config')
const express = require('express');
const db = require('../models');
const session = require('express-session');
const fallback = require('express-history-api-fallback');
const http = require('http');
const port = process.env.port || 3000;
const twilio = require('twilio');
// const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const client = new twilio(config.config.accountSid, config.config.authToken);
const googleMapsClient = require('@google/maps').createClient({
  key: config.keys.geocode,
  Promise: Promise
})
const app = express();

app.use(express.static(`${__dirname}/../dist/browser`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'keyboard cat'
}))
app.use(bodyParser.json());

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

app.post('/signup', (req, res) => {
  // THIS MUST BE CHANGED. WHAT WE WANT IS FOR THE INFORMATION TO BE SENT TO THE DATABASE
  console.log(req.body);
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
      return db.phone.find({ where: { number: textObj.number } });
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
    // googleMapsClient.geocode({
    //   address: textObj.address
    // }, (err, response) => {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     const resultObj = response.json.results[0];
    //     formatAddress = resultObj.formatted_address;
    //   }
    // });
    // req.session.address = formatAddress;

    // .then(() => {
    //   req.session.counter = smsCount + 1;
    //   res.send('done');
    // }).catch(err => console.log(err))
    
  } else {
    // SECOND MESSAGES AND INCORRECT MESSAGES GOES HERE //
    if (req.session.counter > 0) {
      textObj.message = req.body.Body;
      let split = textObj.message.toLowerCase().split(' ');
      if (req.session.command === 'have') {
        if (split.includes('water')){
          db.supply.findOne({
            attributes: ['id'],
            where: {
              type: 'Water',
            }
          }).then((supplyId) => {
            db.pin.findOne({ attributes: ['id'], where: { have: true, address: req.session.address }}).then((pinId) => {
              db.supply_info.create({
                id_supply: supplyId.dataValues.id,
                id_pin: pinId.dataValues.id,
              })
            }).then(() => {
              db.pin.update({ message: req.body.Body },
                {where: {
                    have: true,
                    address: req.session.address
                  }
                }
              )
              }).then(() => {
                return client.messages.create({
                  from: '15043020292',
                  to: textObj.number,
                  body: 'Thank you! Your offering has been added to the map. Please let us know when you run out.',
                })
              }).catch((err) => {
                console.error(err);
              })
            })
        }
        if (split.includes('food')) {
          db.supply.findOne({
            attributes: ['id'],
            where: {
              type: 'Food',
            }
          }).then((supplyId) => {
            db.pin.findOne({ attributes: ['id'], where: { have: true, address: req.session.address } }).then((pinId) => {
              db.supply_info.create({
                id_supply: supplyId.dataValues.id,
                id_pin: pinId.dataValues.id,
              })
            }).then(() => {
              db.pin.update({ message: req.body.Body },
                {
                  where: {
                    have: true,
                    address: req.session.address
                  }
                }
              )
              }).then(() => {
                return client.messages.create({
                  from: '15043020292',
                  to: textObj.number,
                  body: 'Thank you! Your offering has been added to the map. Please let us know when you run out.',
                })
              }).catch((err) => {
                console.error(err);
              })
          })
        } else if (split.includes('shelter')) {
          db.supply.findOne({
            attributes: ['id'],
            where: {
              type: 'Shelter',
            }
          }).then((supplyId) => {
            db.pin.findOne({ attributes: ['id'], where: { have: true, address: req.session.address } }).then((pinId) => {
              db.supply_info.create({
                id_supply: supplyId.dataValues.id,
                id_pin: pinId.dataValues.id,
              })
            }).then(() => {
              db.pin.update({ message: req.body.Body },
                {
                  where: {
                    have: true,
                    address: req.session.address
                  }
                }
              )
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
            db.phone.findOne({
              attributes: ['id'],
              where: {
                number: textObj.number,
              },
              raw: true,
            }).then((phone) => {
              db.pin.findOne({
                attributes: ['id'],
                where: {
                  id_phone: phone.id,
                  address: req.session.address,
                },
                raw: true,
              }).then((pin) => {
                db.supply_info.destroy({
                  where: {
                    id_pin: pin.id,
                    id_supply: 1,
                  }
                })
                }).then(() => {
                  return client.messages.create({
                    from: '15043020292',
                    to: textObj.number,
                    body: 'Thank you. Your offering has been removed to the map.',
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
            db.pin.update(
              {message: req.body.Body},
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
    else {
        return client.messages.create({
          from: '15043020292',
          to: textObj.number,
          body: 'Error: We don\'t know what you mean. Please enter one of the following: \nHelp@[address], \nHave@[address], \nNeed@[address]',
        }).catch(err => console.error(err))
      }
  }
  
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  // res.end(twiml.toString());
  res.end();

}
});

// for page refresh
app.use(fallback('index.html', {root: './dist/browser'}));

http.createServer(app).listen(port, () => console.log(`Express server listening on port ${port}!`));