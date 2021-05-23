import 'reflect-metadata';
import  express , { Application}  from 'express';

import { db } from './config/postgre.config';
import { router } from './api/routes/api';
import { logger } from './middleware/logger'
import { winstonLogger } from './config/winston.config';

db.authenticate()
.then(()=> console.log("DB Connected..."))
.catch(err => console.log("ERROR" + err))


const app : Application = express();
const port = 3000;

app.use(express.json());

app.use(logger);

app.use('/api', router)

app.use(function errorHandler (err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  winstonLogger.error(err);
  res.status(500).send('Internal Server Error');
});

process.on('uncaughtException', (err, origin) => {
  winstonLogger.error(err + 'origin:' + origin);
});
process.on('unhandledRejection', (reason, promise) => {
  winstonLogger.error('Unhandled Rejection at: %s , reason : %s', promise, reason);
});

app.listen(port, () => {
  console.log(`HomeTask 3 app listening at http://localhost:${port}`)
});