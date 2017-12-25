const assert = require('assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');

// express and mocha do not go along with Mongoose nicely in Test environment
// hence we import the Driver model from Mongoose rather requiring the models/driver.js file
const Driver = mongoose.model('driver');

describe('Drivers controller', () => {
  it('Post to /api/drivers creates a new driver', done => {
    // 3 ways to test this
    // 1. add/create a driver in the collection and have it returned from Mongo to inform successfully creation
    // 2. create a driver, save it and see if we can find the new driver in the collection, e.g. similar to joe -> new User
    // 3. count the number of records before adding the new driver, and then count the number
    // after request completes and saved in the collection, and see if the math works out correctly
    // we will go with approach 3 as we already followed the first two approaches in previous examples of Testing

    Driver.count().then(count => {
      request(app)
        .post('/api/drivers')
        .send({ email: 'test@test.com' }) // send along this data with POST request, i.e, customize the request
        .end(() => {
          Driver.count().then(newCount => {
            assert(count + 1 === newCount);
            done();
          });
        });
    });
  });

  it('PUT to /api/drivers/id edits an existing driver', done => {
    const driver = new Driver({ email: 't@t.com', driving: false });

    driver.save().then(() => {
      request(app)
        .put(`/api/drivers/${driver._id}`)
        .send({ driving: true })
        .end(() => {
          Driver.findOne({ email: 't@t.com' }).then(driver => {
            assert(driver.driving === true);
            done();
          });
        });
    });
  });

  it('DELETE to /api/drivers/id can delete a driver', done => {
    const driver = new Driver({ email: 'test@test.com' });

    driver.save().then(() => {
      request(app)
        .delete(`/api/drivers/${driver._id}`)
        .end(() => {
          Driver.findOne({ email: 'test@test.com' }).then(driver => {
            assert(driver === null);
            done();
          });
        });
    });
  });

  it('GET to /api/drivers finds drivers in a location', done => {
    // Lets create 2 sample users far away from each other location wise
    const seattleDriver = new Driver({
      email: 'seattle@test.com',
      geometry: { type: 'Point', coordinates: [-122.4759902, 47.6147628] }
    });
    const miamiDriver = new Driver({
      email: 'miami@test.com',
      geometry: { type: 'Point', coordinates: [-80.253, 25.791] }
    });

    Promise.all([seattleDriver.save(), miamiDriver.save()]).then(() => {
      request(app)
        .get('/api/drivers?lng=-80&lat=25') //we are expecting the test to show drivers only close to this point [lng,lat]
        .end((err, response) => {
          // console.log(response);
          assert(response.body.length === 1); // only one driver must be returned
          assert(response.body[0].obj.email === 'miami@test.com'); //  and that returned driver is miami@test.com
          done();
        });
    });
  });
});
