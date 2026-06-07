require('../src/config/db');
const { swaggerUi, swaggerSpec } = require('../swagger');
const express = require('express');
const rateLimit = require('./middleware/rateLimiter')
const app = express();

const userRoutes = require('../src/routes/user.routes');

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(rateLimit);
module.exports = app;



