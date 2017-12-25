const mongoose = require('mongoose');

before(done => {
  mongoose.connect('mongodb://localhost/muber_test', { useMongoClient: true });
  mongoose.connection.once('open', () => done()).on('error', err => {
    console.warn('Warning', err);
  });
});

beforeEach(done => {
  const { drivers } = mongoose.connection.collections;
  drivers
    .drop()
    // re-create the index on geometry.coordinates from PointSchema
    .then(() => drivers.ensureIndex({ 'geometry.coordinates': '2dsphere' }))
    .then(() => done())
    .catch(() => done());
  // adding catch and passing done to it, because the very first time the test suite runs
  // there is no drivers collection in existence and if we try to drop a collection does not exist
  // an error will be thrown
});
