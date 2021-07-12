import { Sequelize } from "sequelize";
export const db = new Sequelize( 
  process.env.DB_HOST, 
  process.env.DB_USER, 
  process.env.DB_PASS, 
  {
  host: "localhost",
  dialect: "postgres",

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});
