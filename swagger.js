const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'AGV API',
    description: 'agv end point',
  },
  host: 'localhost:8080',
  schemes: ['http'],
};

const outputFile = './swaggerOutput.json';
const endpointsFiles = ['app.js'];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);
