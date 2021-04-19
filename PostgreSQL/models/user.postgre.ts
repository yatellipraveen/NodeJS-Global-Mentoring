import { db } from '../config/postgre.config'
import  Sequelize  from 'sequelize' 

export const Users = db.define('users',{
    age : { type : Sequelize.INTEGER },
    id :  { type : Sequelize.STRING , primaryKey : true , allowNull : false },
    login : { type : Sequelize.STRING },
    password : { type : Sequelize.STRING },
    isDeleted : { type : Sequelize.BOOLEAN},
}, {createdAt : false, updatedAt : false});