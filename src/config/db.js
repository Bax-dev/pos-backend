require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql",
    logging: false,
  }
);

sequelize
  .sync({ alter: true })
  .then(() => console.log("Database & tables synchronized"))
  .catch((err) => console.error("Database sync error:", err));

module.exports = sequelize;
