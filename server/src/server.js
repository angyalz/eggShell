require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./config/logger');

// const path = require('path');
// const staticUrl = path.join(__dirname, '..', 'public', 'angular');

// const swaggerUI = require('swagger-ui-express');
// const YAML = require('yamljs');
// const swaggerDocument = YAML.load('./docs/swagger.yaml');

const app = express();
const staticUrl = '../public/eggShell';
// const swaggerDocument = load('./docs/swagger.yaml');

app.use(morgan('combined', { stream: logger.stream }));
app.use(express.json());
app.use(cors());
app.options('*', cors());

app.use('/', (req, res, next) => {
    console.log(`HTTP ${req.method} ${req.path}`);
    next();
});

// app.post('/login', login);
// app.post('/refresh', refresh);
// app.post('/logout', logout);

app.use('/', require('./controllers/auth/auth.routes'));
app.use('/bartons', require('./controllers/bartons/bartons.routes'));
// app.use('/eggs', require('./controllers/eggs/eggs.routes'));
app.use('/poultry', require('./controllers/poultry/poultry.routes'));
app.use('/users', require('./controllers/users/users.routes'));
app.get('/images/:file', (req, res, next) => {
    logger.info(`file request: ${req.params.file}`);
    res.download(`./public/images/${req.params.file}`);
});
app.get('/images/poultries/:file', (req, res, next) => {
    logger.info(`file request: ${req.params.file}`);
    res.download(`./public/images/poultries/${req.params.file}`);
});

// app.use('/api-doc', serve, setup(swaggerDocument));

app.use('/', express.static(staticUrl));

app.all('*', (req, res) => {
    res.redirect('');
})

app.use((err, req, res, next) => {
    logger.error(`ERROR ${err.statusCode}: ${err.message}`);
    res.status(err.statusCode);
    res.json({
        hasError: true,
        message: err.message
    })
});

module.exports = app;