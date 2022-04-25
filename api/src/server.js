require('dotenv').config();

const express = require('express');
// const cors = require('cors');
const morgan = require('morgan');
const logger = require('./config/logger');

const path = require('path');
const staticUrl = path.join(__dirname, '..', 'public', 'angular');

// const swaggerUI = require('swagger-ui-express');
// const YAML = require('yamljs');
// const swaggerDocument = YAML.load('./docs/swagger.yaml');

const app = express();

app.use(morgan('combined', { stream: logger.stream }));
app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
    const cors = require('cors');
    app.use(cors());
    app.options('*', cors());
}

app.use('/', (req, res, next) => {
    console.log(`HTTP ${req.method} ${req.path}`);
    next();
});

app.use('/api/', require('./controllers/auth/auth.routes'));
app.use('/api/bartons', require('./controllers/bartons/bartons.routes'));
// app.use('/api/eggs', require('./controllers/eggs/eggs.routes'));
app.use('/api/poultry', require('./controllers/poultry/poultry.routes'));
app.use('/api/share/invite', require('./controllers/share/invite/invite.routes'));
app.use('/api/share/request', require('./controllers/share/request/request.routes'));
app.use('/api/users', require('./controllers/users/users.routes'));
app.get('/api/images/:file', (req, res, next) => {
    logger.info(`file request: ${req.params.file}`);
    res.download(`./public/images/${req.params.file}`);
});
app.get('/api/images/poultries/:file', (req, res, next) => {
    logger.info(`file request: ${req.params.file}`);
    res.download(`./public/images/poultries/${req.params.file}`);
});

// app.use('/api-doc', serve, setup(swaggerDocument));

app.use((err, req, res, next) => {
    logger.error(`ERROR ${err.statusCode}: ${err.message}`);
    res.status(err.statusCode);
    res.json({
        hasError: true,
        message: err.message
    })
});

app.get('*/*', express.static(staticUrl));

app.all('*', (req, res) => {
    res.sendFile(`${staticUrl}/index.html`);
})

module.exports = app;