import express from "express";
import morgan from "morgan";
import pkg from "../package.json";
import router from "./routes";
import env from "./config";
import { createRoles } from "./libs/initialSetup.utils";

const app = express();
createRoles();

app.set("pkg", pkg);
app.set("port", env.port);

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    name: app.get("pkg").name,
    author: app.get("pkg").author,
    description: app.get("pkg").description,
  });
});

app.use("/api", router);

export default app;
