import  express , {Request , Response , Application, application} from 'express';
import { User } from './models/user.model';
import { v4 as uuidv4 } from 'uuid';
import * as Joi from 'joi';
import {
  // Creates a validator that generates middlewares
  createValidator
} from 'express-joi-validation';

import { db } from './config/postgre.config';
import { Users } from './models/user.postgre';
import { Op } from 'sequelize';

db.authenticate()
.then(()=> console.log("DB Connected..."))
.catch(err => console.log("ERROR" + err))


const app : Application = express();
const port = 3000;
const validator = createValidator();
const joiConfig = { joi: {convert: true, allowUnknown: true }};

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

app.use(express.json());

app.post('/create', validator.body(createSchema,joiConfig), (req : Request, res : Response) =>{
    let user : User = req.body;
    user.id = uuidv4();
    Users.create(user)
      .then(users => res.send(users))
      .catch(err => res.send(err))
});

app.put('/update',validator.body(updateSchema,joiConfig), (req : Request, res : Response) =>{
  let user : User = req.body;
  Users.update(user, { where : { id : user.id} , returning : true})
    .then(([rows, updatedUser]) => res.send(updatedUser))
    .catch(err => res.send(err))
});

app.get('/user', (req : Request, res : Response) =>{
  let userId = req.query.id?.toString();
  if(userId){
    Users.findByPk(userId)
    .then(users =>{ res.send(users)})
    .catch(err => {
      res.status(404);
      res.statusMessage = "User does not exist";
      res.send();
    })
  }
});

app.get('/autoSuggestedUsers/', (req : Request, res : Response) =>{
  let loginSubstring = req.query.loginSubstring?.toString().toLowerCase() ? req.query.loginSubstring?.toString().toLowerCase() : '' ;
  let limit = req.query.limit ? parseInt(req.query.limit.toString()) : undefined;
  Users.findAll({where : { login : { [Op.like] : '%' + loginSubstring + '%'}  } , limit : limit , order : [ ['login' , 'ASC']]})
    .then(users => res.send(users))
    .catch(err => res.send(err))
});

app.delete('/removeuser', (req : Request, res : Response) =>{
  let userId = req.query.id;
  Users.update( { isDeleted : true}, { where : { id : userId} , returning : true})
    .then(([rows, updatedUser]) => res.send(updatedUser))
    .catch(err => res.send(err))
});

  
app.listen(port, () => {
  console.log(`HomeTask 2 app listening at http://localhost:${port}`)
});