import express from "express";
import dotenv from "dotenv";
import connectDB from "./database";
import routes from "./routes";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use("/api", routes);

const PORT = process.env.PORT || 3000;
export default app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur le port ${PORT}`);
});
