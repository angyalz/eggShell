require('dotenv').config();

const config = require('config');
const logger = require('./config/logger');
const mongoose = require('mongoose');
const app = require('./server');

const PORT = process.env.PORT || config.get('port') || 3000;

mongoose.Promise = global.Promise;

if (!config.has('database')) {
    logger.error('Database config not found');
    process.exit();
};

const connectionString = `${config.get('database.dbType')}${config.get('database.username')}:${config.get('database.password')}@${config.get('database.host')}`;

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false
}).then(() => {
    logger.info('Mongodb connection established')
}).catch((err) => {
    logger.error(err);
    process.exit();
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});