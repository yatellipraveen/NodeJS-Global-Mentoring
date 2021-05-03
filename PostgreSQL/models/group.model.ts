import { db } from '../config/postgre.config'
import  Sequelize  from 'sequelize' 

type permission = 'READ' | 'WRITE' | 'DELETE' | 'SHARE' | 'UPLOAD_FILES';

export type Group = {
    id : string;
    name : string;
    permissions: Array<permission>;
}

export const Groups = db.define('groups',{
    id :  { type : Sequelize.STRING , primaryKey : true , allowNull : false },
    name : { type : Sequelize.STRING,  allowNull : false  },
    permissions : { type : Sequelize.ARRAY(Sequelize.STRING)},
}, {createdAt : false, updatedAt : false});