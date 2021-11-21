require('dotenv').config();

import express, { json, static } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { stream as _stream, info, error } from './_config/logger';
import { join } from 'path';
// import { serve, setup } from 'swagger-ui-express';
// import { load } from 'yamljs';
import { login, refresh, logout } from './auth/authHandler';

const app = express();
const staticUrl = join(__dirname, '..', 'public', 'eggShell');
// const swaggerDocument = load('./docs/swagger.yaml');

app.use(morgan('combined', { stream: _stream }));
app.use(json());
app.use(cors());
app.options('*', cors());

app.use('/', (req, res, next) => {
    console.log(`HTTP ${req.method} ${req.path}`);
    next();
});

app.post('/login', login);
app.post('/refresh', refresh);
app.post('/logout', logout);

app.use('/eggs', require('./controllers/eggs/eggs.routes'));
app.use('/users', require('./controllers/users/users.routes'));
app.get('/images/:file', (req, res, next) => {
    info(`file request: ${req.params.file}`);
    res.download(`./public/images/${req.params.file}`);
});

// app.use('/api-doc', serve, setup(swaggerDocument));

app.use('/', static(staticUrl));

app.all('*', (req, res) => {
    res.redirect('');
})

app.use((err, req, res, next) => {
    error(`ERROR ${err.statusCode}: ${err.message}`);
    res.status(err.statusCode);
    res.json({
        hasError: true,
        message: err.message
    })
});

export default app;