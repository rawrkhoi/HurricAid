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
const app = express();

app.use(express.static(`${__dirname}/../dist/browser`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'keyboard cat'
}))
app.use(bodyParser.json());

app.post('/test', (req, res) => {
  db.sequelize.query(`INSERT INTO supplies (food, water, shelter, other) VALUES (true, false, true, 'yoyoyo')`).then((supply) => {
    db.supplies.find(supply.id).then((result) => {
      console.log(result.dataValues.id);
    });
  });
});

app.post('/helpPin', (req, res) => {
  let { message, address, lat, lng } = req.body.pin;
  db.sequelize.query(`INSERT INTO pins (help, address, message, latitude, longitude) VALUES (true, '${address}', '${message}', '${lat}', '${lng}')`).then(() => {
    console.log('help pin inserted to database');
    res.end(); 
  });
}); 

app.get('/getHelpPins', (req, res) => {
  db.sequelize.query(`SELECT * FROM pins where help = true`).then(([pins]) => {
    res.send(pins);
  });
});

app.post('/havePin', (req, res) => {
  let { address, lat, lng, food, water, shelter, other } = req.body.pin;
  db.sequelize.query(`INSERT INTO supplies (food, water, shelter, other) VALUES ('${food}', '${water}', '${shelter}', '${other}')`).then((test) => {
    console.log(test);
  });
  db.sequelize.query(`INSERT INTO pins (have, id_supplies, address, latitude, longitude) VALUES (true, '${id_supplies}',${address}', '${lat}', '${lng}')`).then(() => {
    res.end(); 
  });
}); 

app.get('/getHavePins', (req, res) => {
  db.sequelize.query(`SELECT * FROM pins where have = true`).then(([pins]) => {
    res.send(pins); 
  });
});


app.post('/signup', (req, res) => {
  // THIS MUST BE CHANGED. WHAT WE WANT IS FOR THE INFORMATION TO BE SENT TO THE DATABASE
  console.log(req.body);
});

app.post('/sms', (req, res) => {
  // const twiml = new MessagingResponse();
  let textObj = {};
  const smsCount = req.session.counter || 0;
  
  // OPTIONS //
  if (req.body.Body.slice(0, 7).toLowerCase() === 'options') {
    return client.messages.create({
      from: '15043020292',
      to: textObj.number,
      body: "Try one of these commands: \nHelp@[address], \nHave@[address], \nNeed@[address]",
    })
    
    // HELP //
  } else if (req.body.Body.replace("'", "").slice(0, 5).toLowerCase() === 'help@') {
    req.session.command = 'help';
    textObj.address = req.body.Body.slice(5);
    textObj.number = req.body.From.slice(1);
    if (!req.session.counter){
      req.session.counter = smsCount;
    } 
    // req.session.counter = smsCount + 1;
    // GET GEOCODE
    // app.get(`https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyC9Mp1lWq6EtgUVZ7WewQvVjuxa2CliQmE`, (req, res) => {
    //   res.send('REQUEST BODY!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    // });

    return client.messages.create({
      from: '15043020292',
      to: textObj.number,
      body: 'SOS marker created. You may now send a brief message with details (optional).',
    }).then(() => {
      db.phone.findOne({
        where: {
          number: textObj.number
        },
        raw: true,
      }).then((num) => {
        if (!num) {
          db.phone.create({
            number: textObj.number
          }).then(() => {
            db.phone.find({ where: { number: textObj.number } }).then((phone) => {
              console.log(phone, 'THIS IS THE PHONE')
              db.pin.create({
                help: true,
                address: textObj.address,
                // latitude: ,
                // longitude: ,
                id_phone: phone.dataValues.id,
              }).then(() => {
                req.session.counter = smsCount + 1;

              })
            })
          })
        } else {
          db.phone.find({ where: { number: textObj.number } }).then((phone) => {
            console.log(phone, 'THIS IS THE PHONE')
            db.pin.create({
              help: true,
              address: textObj.address,
              // latitude: ,
              // longitude: ,
              id_phone: phone.dataValues.id,
            }).then(() => {
              req.session.counter = smsCount + 1;
            })
          })
        }
      })
    }).then(() => {
      console.log(req.session, 'REQUEST SESSION, LOOK FOR command AND COUNTER');
    })
    .catch((e) => {
      console.error(e);
    })

    // HAVE //
  } else if (req.body.Body.replace("'", "").slice(0, 5).toLowerCase() === 'have@') {
    req.session.command = 'have';
    if (!req.session.counter) {
      req.session.counter = smsCount;
    }
    textObj.address = req.body.Body.slice(5);
    req.session.address = textObj.address;
    // twiml.message('What would you like to offer? Text 1 for Food, 2 for Water, 3 for Shelter, 4 for Other');
    return client.messages.create({
      from: '15043020292',
      to: textObj.number,
      body: 'What would you like to offer? Text 1 for Food, 2 for Water, 3 for Shelter, 4 for Other',
    })
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
    textObj.address = req.body.Body.slice(5);
    req.session.address = textObj.address;
    // twiml.message('What do you need? Text 1 for Food, 2 for Water, 3 for Shelter');
    return client.messages.create({
      from: '15043020292',
      to: textObj.number,
      body: 'What do you need? Text 1 for Food, 2 for Water, 3 for Shelter',
    })
    req.session.counter = smsCount + 1;
    // send back a message with 3 closest places who have that


    // OUT //
  } else if (req.body.Body.replace("'", "").slice(0, 4).toLowerCase() === 'out@') {
    req.session.command = "out";
    if (!req.session.counter) {
      req.session.counter = smsCount;
    }
    textObj.address = req.body.Body.slice(4);
    req.session.address = textObj.address;
    console.log(textObj);
    return client.messages.create({
      from: '15043020292',
      to: '15042615620',
      body: mappedPlaces,
    })
    // twiml.message('What are you out of? Text 1 for Food, 2 for Water, 3 for Shelter, 4 for Other');
    req.session.counter = smsCount + 1;

    
    // SECOND MESSAGES AND INCORRECT MESSAGES GOES HERE //
  } else {
    let regexp = /[A-Z]/gi;
    let test;
    console.log(req.session, 'MADE IT HERE', 'check for counter');
    if (req.session.counter > 0) {
      console.log('session is GREATER THAN ZERO!!!!');
      textObj.message = req.body.Body;
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
              client.messages.create({
                from: '15043020292',
                to: textObj.number,
                body: 'Added pin. To remove a pin, type out@[address]',
              })
              // twiml.message("Added pin. To remove a pin, type out@[address]");
            } 
            if (split.includes('2')) {
              updateSupplies('water');
              client.messages.create({
                from: '15043020292',
                to: textObj.number,
                body: 'Added pin. To remove a pin, type out@[address]',
              })
              // twiml.message("Added pin. To remove a pin, type out@[address]");
            } 
            if (split.includes('3')) {
              updateSupplies('shelter');
              client.messages.create({
                from: '15043020292',
                to: textObj.number,
                body: 'Added pin. To remove a pin, type out@[address]',
              })
              // twiml.message("Added pin. To remove a pin, type out@[address]");
            } 
            if (split.includes('4')) {
              updateSupplies('other');
              return client.messages.create({
                from: '15043020292',
                to: textObj.number,
                body: 'Added pin. To remove a pin, type out@[address]',
              })
              // twiml.message("Ok, send message with what you want to offer");
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
          db.sequelize.query(`UPDATE have_pins SET other = '${textObj.message}' from phones where phones.number = '${textObj.number}' and have_pins.id_phone = (select id from phones where number='${textObj.number}')`);
          // else if other is true on the have pins table for that phone number
          // update other to a new message
          test = false;
        } 
      } else if (req.session.command === 'need'){
        textObj.message = req.body.Body;
        let split = textObj.message.split('');
        if (!textObj.message.match(regexp)) {
          let findSupplies = (supply) =>  db.have_pins.findAll({
            where: {
              [supply]: true,
            },
            raw: true,
          })
          if (split.includes('1')) {
            findSupplies('food').then((places) => {
              let mappedPlaces = places.map((place) => {
                return place.address;
              }).join(', ');
              return client.messages.create({
                from: '15043020292',
                to: '15042615620',
                body: mappedPlaces,
              }).then((twilioResponse) => {
                console.log('the message was sent!', twilioResponse);
              }).catch((err) => {
                console.log(err, 'ERROR');
              })
            })
            }
          if (split.includes('2')) {
            findSupplies('water').then((places) => {
              let mappedPlaces = places.map((place) => {
                return place.address;
              }).join(', ');
              return client.messages.create({
                from: '15043020292',
                to: '15042615620',
                body: mappedPlaces,
              }).then((twilioResponse) => {
                console.log('the message was sent!', twilioResponse);
              }).catch((err) => {
                console.log(err, 'ERROR');
              })
            })
          }
            if (split.includes('3')) {
              findSupplies('shelter').then((places) => {
                let mappedPlaces = places.map((place) => {
                  return place.address;
                }).join(', ');
                return client.messages.create({
                  from: '15043020292',
                  to: '15042615620',
                  body: mappedPlaces,
                }).then((twilioResponse) => {
                  console.log('the message was sent!', twilioResponse);
                }).catch((err) => {
                  console.log(err, 'ERROR');
                })
              })
        }
      } else {
        console.log('this was done incorrectly');
      }
      } else if (req.session.command === 'out'){  
        if (!textObj.message.match(regexp)) {
          let split = textObj.message.split('');
          let findAddress = (address) => db.have_pins.findAll({
            where: {
              [address]: req.session.address,
              id_phone: textObj.number,
            },
            raw: true,
          })
          let findSupplies = (supply) => db.have_pins.findAll({
            where: {
              [supply]: true,
            },
            raw: true,
          })
          if (split.includes('1')) {
            console.log(textObj.address);
              findAddress(textObj.address);
              // .then((twilioResponse) => {
              //   console.log('the supply was removed', twilioResponse);
              // }).catch((err) => {
              //   console.log(err, 'ERROR');
              // })
          }
        }
      } else if (req.session.command === 'help'){
      console.log("HELP!! THIS IS THE SESSION\'S COMMAND");
      db.sequelize.query(`UPDATE pin SET message = '${req.body.Body}' from phone where phone.number = '${textObj.number}' and pin.id_phone = (select id from phone where number='${textObj.number}) and pin.help = true'`);
      return client.messages.create({
        from: '15043020292',
        to: textObj.number,
        body: 'Message added to marker.',
      })
    }
    else {
        return client.messages.create({
          from: '15043020292',
          to: textObj.number,
          body: 'Error: We don\'t know what you mean. Please enter one of the following: \nHelp@[address], \nHave@[address], \nNeed@[address]',
        })
      // twiml.message("Error: We don\'t know what you mean. Please enter one of the following: \nHelp@[address], \nHave@[address], \nNeed@[address]")
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