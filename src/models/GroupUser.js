import { DataTypes } from 'sequelize';
import { sequelize } from '../db/connection';
import User from './User';
import Group from './Group';

const GroupUser = sequelize.define(
	'GroupUser',
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			unique: true,
		},
		groupId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		status: {
			type: DataTypes.STRING,
			defaultValue: 'active',
		},
	},
	{
		timestamps: false,
		tableName: 'groupsUsers',
	},
);

User.belongsToMany(Group, {
	through: GroupUser,
	foreignKey: 'userId',
	otherKey: 'groupId',
});
Group.belongsToMany(User, {
	through: GroupUser,
	foreignKey: 'groupId',
	otherKey: 'userId',
});
User.hasMany(GroupUser, { foreignKey: 'userId', sourceKey: 'id' });
GroupUser.belongsTo(User, { foreignKey: 'userId', sourceKey: 'id' });
Group.hasMany(GroupUser, { foreignKey: 'groupId', sourceKey: 'id' });
GroupUser.belongsTo(Group, { foreignKey: 'groupId', sourceKey: 'id' });

export default GroupUser;
