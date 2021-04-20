import { Router } from 'express';
import * as Joi from 'joi';
import {
  // Creates a validator that generates middlewares
  createValidator
} from 'express-joi-validation';
import { User } from '../../models/user.model';
import Container from 'typedi';
import UserService from '../../services/users.service';


const validator = createValidator();
const joiConfig = { joi: {convert: true, allowUnknown: true }};
const userServiceInstance = Container.get(UserService);

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