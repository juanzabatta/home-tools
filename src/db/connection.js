import { Sequelize } from 'sequelize';
  
export const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USERNAME, 
	process.env.DB_PASSWORD, 
	{
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIALECT,
		pool: {
			max: 5,
			min: 0,
			require: 30000,
			idle: 10000,
		},
		logging: false,
	},
);

async function synchronization() {
	await sequelize.sync({ alter: true });
	// console.log('All models were synchronized successfully.');
}

synchronization();
