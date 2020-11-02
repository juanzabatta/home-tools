import { DataTypes } from 'sequelize';
import { sequelize } from '../db/connection';

const Group = sequelize.define(
	'Group',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			unique: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		code: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
    },
    created: {
			type: DataTypes.STRING,
		}
	},
	{
    timestamps: false,
		tableName: 'groups',
	},
);

export default Group;
