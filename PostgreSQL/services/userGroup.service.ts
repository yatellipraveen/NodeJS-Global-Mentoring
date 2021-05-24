import { Op } from 'sequelize';
import { Service } from 'typedi';
import { User } from '../models/user.model';
import { Users } from '../models/user.postgre';
import { v4 as uuidv4 } from 'uuid';
import { Group, Groups } from '../models/group.model';
import { UserGroups } from '../models/userGroup.postgre';

@Service()
export default class UserGroupService {

    async getautoSuggestedUsers( loginSubstring : string , limit : number | undefined){
      return Users.findAll({where : { login : { [Op.like] : '%' + loginSubstring + '%'}  } , limit : limit , order : [ ['login' , 'ASC']]})
      .then(users => users)
      .catch(err => err)
    }

    async deleteGroup( groupId : string | undefined){
      return Groups.destroy( { where : { id : groupId} })
    }

    async getGroup( groupId : string | undefined){
      return Groups.findByPk(groupId)
    }

    async getAllGroups(){
      return Groups.findAll()
    }

    async updateGroup ( group : Group ){
      return Groups.update(group, { where : { id : group.id} , returning : true})
    }

    async createGroup (group : Group){
      group.id = uuidv4();
      return Groups.create(group)
    }

    async addUserGroup ( userId : string , groupId : string){
      return UserGroups.create({ 'id': uuidv4(), 'userId' : userId , 'groupId': groupId})
    }

}

