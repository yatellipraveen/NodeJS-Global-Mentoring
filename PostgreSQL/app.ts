import 'reflect-metadata';
import  express , { Application}  from 'express';

import { db } from './config/postgre.config';
import { router } from './api/routes/api';

db.authenticate()
.then(()=> console.log("DB Connected..."))
.catch(err => console.log("ERROR" + err))


const app : Application = express();
const port = 3000;

app.use(express.json());

app.use('/api', router)
  
app.listen(port, () => {
  console.log(`HomeTask 3 app listening at http://localhost:${port}`)
});