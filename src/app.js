import express from "express";
import morgan from "morgan";
import pkg from "../package.json";
import router from "./routes";
import env from "./config";
import { createRoles, createAdmin } from "./libs/initialSetup.utils";

// Initializations
const app = express();

// Create roles if not exists in database
createRoles();

// Create user admin if not exists in database
createAdmin();

// Settings
app.set("pkg", pkg);
app.set("port", env.port);
app.use(express.json());

// Middlewares
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => {
  res.json({
    name: app.get("pkg").name,
    author: app.get("pkg").author,
    description: app.get("pkg").description,
  });
});
app.use("/api", router);

export default app;
