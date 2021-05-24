import { Op } from 'sequelize';
import { Service } from 'typedi';
import { User } from '../models/user.model';
import { Users } from '../models/user.postgre';
import { v4 as uuidv4 } from 'uuid';

@Service()
export default class UserService {

    async getautoSuggestedUsers( loginSubstring : string , limit : number | undefined){
      return Users.findAll({where : { login : { [Op.like] : '%' + loginSubstring + '%'}  } , limit : limit , order : [ ['login' , 'ASC']]})
    }

    async deleteUser( userId : string | undefined){
      return Users.update( { isDeleted : true}, { where : { id : userId} , returning : true})
    }

    async getUser( userId : string | undefined){
      return Users.findByPk(userId)
    }

    async updateUser ( user : User){
      return Users.update(user, { where : { id : user.id} , returning : true})
    }

    async createUser (user : User){
      user.id = uuidv4();
      return Users.create(user)
    }
}

