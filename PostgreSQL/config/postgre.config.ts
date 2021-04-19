import { Sequelize } from 'sequelize' 
export const db = new Sequelize('nodeGMP', 'postgres', 'asdfghjkl', {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});