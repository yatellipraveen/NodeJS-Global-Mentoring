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

export const router = Router();

router.get('/autoSuggestedUsers/', async (req , res ) => {
    const loginSubstring = req.query.loginSubstring?.toString().toLowerCase() ? req.query.loginSubstring?.toString().toLowerCase() : '' ;
    const limit = req.query.limit ? parseInt(req.query.limit.toString()) : undefined;
    const users = await userServiceInstance.getautoSuggestedUsers(loginSubstring , limit);
    res.send(users);
});

router.delete('/removeuser', async (req , res ) =>{
  const userId = req.query.id?.toString();
  const user = await userServiceInstance.deleteUser(userId);
  res.send(user);
});

router.get('/user', async (req , res ) =>{
  const userId = req.query.id?.toString();
  const user = await userServiceInstance.getUser( userId );
  res.send(user);
  }
);

router.put('/update',validator.body(updateSchema,joiConfig), async (req, res ) =>{
  const user : User = req.body;
  const updatedUser = await userServiceInstance.updateUser(user); 
  res.send(updatedUser);
});

router.post('/create', validator.body(createSchema,joiConfig), async (req , res ) =>{
  const user : User = req.body;
  const createdUser = await userServiceInstance.createUser(user);
  res.send(createdUser);
});

router.post('/createGroup', validator.body(createGroupSchema,joiConfig), async (req, res) =>{
  const group = req.body;
  const createdGroup = await groupServiceInstance.createGroup(group);
  res.send(createdGroup);
});

router.put('/updateGroup',validator.body(updateGroupSchema,joiConfig), async (req, res ) =>{
  const group = req.body;
  const updatedUserGroup = await groupServiceInstance.updateGroup(group); 
  res.send(updatedUserGroup);
});

router.get('/group', async (req , res ) =>{
  const groupId = req.query.id?.toString();
  const group = await groupServiceInstance.getGroup( groupId );
  res.send(group);
  }
);

router.get('/getAllGroups', async (req , res ) =>{
  const groups = await groupServiceInstance.getAllGroups();
  res.send(groups);
  }
);

router.delete('/deleteGroup', async (req , res ) =>{
  const groupId = req.query.id?.toString();
  const user = await groupServiceInstance.deleteGroup(groupId);
  res.send(user);
});

router.post('/addUserGroup', validator.body(createUserGroupSchema,joiConfig), async (req, res) =>{
  const userId = req.body.userId;
  const groupId = req.body.groupId;
  const createdGroup = await groupServiceInstance.addUserGroup(userId,groupId);
  res.send(createdGroup);
})