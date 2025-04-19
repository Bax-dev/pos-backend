
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./src/config/db");
const routes = require("./src/routes/urls");   

dotenv.config();
console.log("🕵️ JWT_SECRET:", process.env.JWT_SECRET); // Log the JWT secret (for debugging onl

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use("/api", routes);

sequelize.sync()
  .then(() => console.log("✅ Database synced successfully"))
  .catch((err) => console.error("Database sync error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
