import { Op } from 'sequelize';
import { Service } from 'typedi';
import { User } from '../models/user.model';
import { Users } from '../models/user.postgre';
import { v4 as uuidv4 } from 'uuid';

@Service()
export default class UserService {

    async getautoSuggestedUsers( loginSubstring : string , limit : number | undefined){
      return Users.findAll({where : { login : { [Op.like] : '%' + loginSubstring + '%'}  } , limit : limit , order : [ ['login' , 'ASC']]})
      .then(users => users)
      .catch(err => err)
    }

    async deleteUser( userId : string | undefined){
      return Users.update( { isDeleted : true}, { where : { id : userId} , returning : true})
      .then(([rows, updatedUser]) => updatedUser)
      .catch(err => err)
    }

    async getUser( userId : string | undefined){
      return Users.findByPk(userId)
      .then(users =>users)
      .catch(err => err)
    }

    async updateUser ( user : User){
      return Users.update(user, { where : { id : user.id} , returning : true})
      .then(([rows, updatedUser]) => updatedUser)
      .catch(err => err)
    }

    async createUser (user : User){
      user.id = uuidv4();
      return Users.create(user)
      .then(users => users)
      .catch(err => err)
    }
}

