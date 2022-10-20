const path = require('path');

const authRoute = require('./routes/authRoute');
const viewRoute = require('./routes/viewRoute');
const taskRoute = require('./routes/taskRoute');
const agvRoute = require('./routes/agvRoute');
const assignmentRoute = require('./routes/assignmentRoute');

const globalErrorHandler = require('./controllers/errorController');

const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swaggerOutput.json');
require('./models/foundations/sectionModel');
require('./models/userModel');
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.enable('trust proxy');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(cookieParser());

app.use('/', viewRoute);
app.use('/api/v1/user', authRoute);
app.use('/api/v1/task', taskRoute);
app.use('/api/v1/agv', agvRoute);
app.use('/api/v1/assignment', assignmentRoute);
app.use(globalErrorHandler);

module.exports = app;
