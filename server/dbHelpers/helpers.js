const db = require('../../models');



let addHaves = (supply, req) => {
  db.supply.findAll({
    attributes: ['id'],
    where: {
      type: supply,
    },
    raw: true
  }).then((supplyId) => {
    console.log(supplyId, 'SUPPLY ID!!!!!!!!!!!!!!!')
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
    })
      .then(() => {
        return client.messages.create({
          from: '15043020292',
          to: textObj.number,
          body: 'Thank you! Your offering has been added to the map.',
        })
      }).then(() => {
        req.session.pinId = null;
      }).catch((err) => {
        console.error(err);
      })
  })
}

module.exports = {
  addHaves,
}