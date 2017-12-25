const Driver = require('../models/driver');
module.exports = {
  // ES5 syntax
  // greeting: function (req,res) {}
  // ES6 syntax
  greeting(req, res) {
    res.send({ hi: 'there' });
  },

  index(req, res, next) {
    // 'http://google.com?lng=80&lat=20' - query string after '?' mark
    const { lng, lat } = req.query;

    Driver.geoNear(
      { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] }, // [lng, lat] - is the center of the user's location
      { spherical: true, maxDistance: 200000 } // 200000 meters or 200 km
    )
      .then(drivers => res.send(drivers))
      .catch(next);
  },

  create(req, res, next) {
    // console.log(req.body);
    // body : { email: 'test@test.com' }...i.e., body contains any data sent along with the POST request
    // res.send({ hi: 'there' });

    const driverProps = req.body;

    Driver.create(driverProps)
      .then(driver => res.send(driver))
      .catch(next);
  },

  edit(req, res, next) {
    const driverId = req.params.id;
    const driverProps = req.body;

    // findByIdAndUpdate updates the record, but does not return back the updated record
    // hence we need to do findById to get the updated record
    Driver.findByIdAndUpdate({ _id: driverId }, driverProps)
      .then(() => Driver.findById({ _id: driverId }))
      .then(driver => res.send(driver))
      .catch(next);
  },

  delete(req, res, next) {
    const driverId = req.params.id;

    Driver.findByIdAndRemove({ _id: driverId })
      .then(driver => res.status(204).send(driver))
      .catch(next);
  }
};
