const DriversController = require('../controllers/drivers_controller');

module.exports = app => {
  // Watch for incoming requests of method GET
  // to the route http;//localhost:3050/api
  // app.get('/api', (req, res) => {
  //   res.send({ hi: 'there' });
  // });

  app.get('/api', DriversController.greeting);

  // create new Driver
  app.post('/api/drivers', DriversController.create);

  // edits to Driver, req made with id in the url- /api/drivers/adasdasqweq
  app.put('/api/drivers/:id', DriversController.edit);

  // delete a Driver, req made with id in the url- /api/drivers/adasdasqweq
  app.delete('/api/drivers/:id', DriversController.delete);

  // Returns a list of records
  app.get('/api/drivers', DriversController.index);
};
