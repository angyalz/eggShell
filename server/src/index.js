require('dotenv').config();

import { get, has } from 'config';
import { error, info } from './config/logger';
import { Promise, set, connect } from 'mongoose';
import app from './server';

const PORT = process.env.PORT || get('port') || 3000;

Promise = global.Promise;
set('useFindAndModify', false);

if (!has('database')) {
    error('Database config not found');
    process.exit();
};

const connectionString = `${get('database.dbType')}${get('database.username')}:${get('database.password')}@${get('database.host')}`;

connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    info('Mongodb connection established')
}).catch((err) => {
    error(err);
    process.exit();
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});