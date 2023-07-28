import express from "express";
import morgan from "morgan";
import pkg from "../package.json";
import router from "./routes";

const app = express();

app.set("pkg", pkg);

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
