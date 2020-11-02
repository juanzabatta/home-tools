require('dotenv-flow').config();

module.exports = {
	NODE_ENV: process.env.NODE_ENV || 'development',
	HOST: process.env.HOST || '192.168.0.4',
	PORT: process.env.PORT || 3000,
};
