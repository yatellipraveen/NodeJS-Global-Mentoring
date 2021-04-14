import  express , {Request , Response , Application, application} from 'express';
import { User } from './models/user.model';
import { v4 as uuidv4 } from 'uuid';
import * as Joi from 'joi';
import {
  // Creates a validator that generates middlewares
  createValidator
} from 'express-joi-validation';

const app : Application = express();
const port = 3000;
const users : User[] = [];
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
    users.push(user);
    res.send(user);
});

app.put('/update',validator.body(updateSchema,joiConfig), (req : Request, res : Response) =>{
  let user : User = req.body;
  let existingUser =  users.findIndex(x => x.id === user.id);
  if(existingUser > -1){
    users.splice(existingUser , 1);
    users.push(user);
    res.send(user);
  }
  res.status(404);
  res.statusMessage = "User does not exist";
  res.send();
});

app.get('/user', (req : Request, res : Response) =>{
  let userId = req.query.id;
  let existingUser =  users.find(x => x.id === userId);
  if(existingUser){
    res.send(existingUser);
  }
  res.status(404);
  res.statusMessage = "User does not exist";
  res.send();
});

app.get('/autoSuggestedUsers/', (req : Request, res : Response) =>{
  let loginSubstring = req.query.loginSubstring?.toString().toLowerCase() ? req.query.loginSubstring?.toString().toLowerCase() : '' ;
  let limit = req.query.limit ? parseInt(req.query.limit.toString()) : null;
  let filteredUsers = users.filter(x => x.login.toLowerCase().includes(loginSubstring));
  filteredUsers.sort(compare);
  if(limit){
    filteredUsers = filteredUsers.slice(0 ,limit)
  }
  res.send(filteredUsers);
});

app.delete('/removeuser', (req : Request, res : Response) =>{
  let userId = req.query.id;
  let existingUser =  users.find(x => x.id === userId);
  if(existingUser){
    existingUser.isDeleted = true;
    res.send(existingUser);
  }
  res.status(404);
  res.statusMessage = "User does not exist";
  res.send();
});

function compare( a : User , b : User){
  if( a.login.toLowerCase() < b.login.toLowerCase()){
    return -1;
  }
  else if (a.login.toLowerCase() > b.login.toLowerCase()){
    return 1;
  } 
  return 0;
}

  
app.listen(port, () => {
  console.log(`HomeTask 2 app listening at http://localhost:${port}`)
});