import { db } from '../config/postgre.config'
import  Sequelize  from 'sequelize' 

export const UserGroups = db.define('usergroups',{
    id :  { type : Sequelize.STRING , primaryKey : true , allowNull : false },
    userId :  { type : Sequelize.STRING , allowNull : false },
    groupId : { type : Sequelize.STRING , allowNull : false },
}, {createdAt : false, updatedAt : false});