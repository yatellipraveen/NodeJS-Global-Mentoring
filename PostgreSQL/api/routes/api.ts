import { Router } from 'express';
import * as Joi from 'joi';
import {
  // Creates a validator that generates middlewares
  createValidator
} from 'express-joi-validation';
import { User } from '../../models/user.model';
import Container from 'typedi';
import UserService from '../../services/users.service';
import UserGroupService from '../../services/userGroup.service';
import { winstonLogger } from '../../config/winston.config';
import * as jwt from 'jsonwebtoken';
import { validateJwt, privateKey } from '../../middleware/jwtValidator'

const validator = createValidator();
const joiConfig = { joi: {convert: true, allowUnknown: true }};
const userServiceInstance = Container.get(UserService);
const groupServiceInstance = Container.get(UserGroupService);

const createSchema = Joi.object({
  login: Joi.string().required(),
  password : Joi.string().alphanum().required(),
  age : Joi.number().integer().required().min(4).max(130),
});

const updateSchema = Joi.object({
  id : Joi.string().required(),
  login: Joi.string().required(),
  password : Joi.string().alphanum().required(),
  age : Joi.number().integer().required().min(4).max(130),
})

const createGroupSchema = Joi.object({
  name : Joi.string().required(),
  permissions : Joi.array().required()
});

const updateGroupSchema = Joi.object({
  id: Joi.string().required(),
  name : Joi.string().required(),
  permissions : Joi.array().required()
});

const createUserGroupSchema = Joi.object({
  userId : Joi.string().required(),
  groupId : Joi.string().required()
});

const loginSchema = Joi.object({
  username : Joi.string().required(),
  password : Joi.string().required()
});

export const router = Router();

router.get('/autoSuggestedUsers/', validateJwt, (req , res , next ) => {
    const loginSubstring = req.query.loginSubstring?.toString().toLowerCase() ? req.query.loginSubstring?.toString().toLowerCase() : '' ;
    const limit = req.query.limit ? parseInt(req.query.limit.toString()) : undefined;
    userServiceInstance.getautoSuggestedUsers(loginSubstring , limit)
    .then(users => res.send(users))
    .catch(err => {
      winstonLogger.error("method : %s , arguments passed : %s , error : %s", 'getautoSuggestedUsers', [loginSubstring , limit].join(' ') , err);
      next(err)
    })
});

router.delete('/removeuser',validateJwt, (req , res , next ) =>{
  const userId = req.query.id?.toString();
  userServiceInstance.deleteUser(userId)
  .then(([rows, updatedUser]) => res.send(updatedUser))
  .catch(err => {
    winstonLogger.error("method : %s , arguments passed : %s , error : %s", 'deleteUser', userId , err);
    next(err)
  })
});

router.get('/user',validateJwt, (req , res, next ) =>{
  const userId = req.query.id?.toString();
  userServiceInstance.getUser( userId )
  .then(users => res.send(users))
  .catch(err => {
    winstonLogger.error("method : %s , arguments passed : %s , error : %s", 'getUser', userId , err);
    next(err)
  })
  }
);

router.put('/update',validateJwt, validator.body(updateSchema,joiConfig), (req, res , next ) =>{
  const user : User = req.body;
  userServiceInstance.updateUser(user)
  .then(([rows, updatedUser]) => res.send(updatedUser))
  .catch(err => {
    winstonLogger.error("method : %s , arguments passed : %s , error : %s", 'updateUser', user , err);
    next(err)
  }); 
});

router.post('/create',validateJwt, validator.body(createSchema,joiConfig), (req , res , next ) =>{
  const user : User = req.body;
  userServiceInstance.createUser(user)
  .then(createdUser => res.send(createdUser))
  .catch(err => {
    winstonLogger.error("method : %s , arguments passed : %s , error : %s", 'creteUser', user , err);
    next(err)
  });
});

router.post('/createGroup',validateJwt, validator.body(createGroupSchema,joiConfig), (req, res , next) =>{
  const group = req.body;
  groupServiceInstance.createGroup(group)
  .then(group => res.send(group))
  .catch(err => {
    winstonLogger.error("method : %s , arguments passed : %s , error : %s", 'createGroup', group , err);
    next(err)
  })
});

router.put('/updateGroup',validateJwt, validator.body(updateGroupSchema,joiConfig), (req, res , next) =>{
  const group = req.body;
  groupServiceInstance.updateGroup(group)
  .then(([rows, updatedGroup]) => res.send(updatedGroup))
  .catch(err => {
    winstonLogger.error("method : %s , arguments passed : %s , error : %s", 'updateGroup', group , err);
    next(err)
  })
});

router.get('/group',validateJwt, (req , res, next ) =>{
  const groupId = req.query.id?.toString();
  groupServiceInstance.getGroup( groupId )
  .then(group => res.send(group))
  .catch(err => {
    winstonLogger.error("method : %s , arguments passed : %s , error : %s", 'getGroup', groupId , err);
    next(err)
  })
  }
);

router.get('/getAllGroups',validateJwt, (req , res, next ) =>{
  groupServiceInstance.getAllGroups()
  .then(usergroup => res.send(usergroup))
  .catch(err => {
    winstonLogger.error("method : %s , arguments passed : %s , error : %s", 'getAllGroups', '' , err);
    next(err)
  })
  }
);

router.delete('/deleteGroup',validateJwt, (req , res, next ) =>{
  const groupId = req.query.id?.toString();
  groupServiceInstance.deleteGroup(groupId)
  .then((rows) =>  res.send(true))
  .catch(err => {
    winstonLogger.error("method : %s , arguments passed : %s , error : %s", 'deleteGroup', groupId , err);
    next(err)
  })
});

router.post('/addUserGroup',validateJwt, validator.body(createUserGroupSchema,joiConfig), (req, res , next) =>{
  const userId = req.body.userId;
  const groupId = req.body.groupId;
  groupServiceInstance.addUserGroup(userId,groupId)
  .then(userGroup => res.send(userGroup))
  .catch(err => {
    winstonLogger.error("method : %s , arguments passed : %s , error : %s", 'addUserGroup', [userId , groupId].join(' ') , err);
    next(err)
  })
});

router.post('/login', validator.body(loginSchema,joiConfig), (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  userServiceInstance.findUser(username , password)
  .then(user => {
    if(user){
      const token = jwt.sign({ username: username }, privateKey, { expiresIn: 120 });
      res.send(token);
    }
    else res.send("User Invalid");
  })
  .catch(err => {
    winstonLogger.error("method : %s , arguments passed : %s , error : %s", 'login', [username , password].join(' ') , err);
    next(err)
  })
});