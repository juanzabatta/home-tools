import { DataTypes } from 'sequelize';
import { sequelize } from '../db/sequelizeConnection';

const User = sequelize.define(
	'User',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			unique: true,
		},
		firstName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		phone: { type: DataTypes.INTEGER },
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		emailNotifications: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		emailVerificated: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
		createdAt: {
			type: DataTypes.DATE,
		},
		updatedAt: {
			type: DataTypes.DATE,
		},
	},
	{
		tableName: 'users',
	},
);

export default User;
