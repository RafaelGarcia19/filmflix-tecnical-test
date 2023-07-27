import express from "express";
import morgan from "morgan";
import pkg from "../package.json";

const app = express();

import moviesRoutes from "./routes/movies.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

app.set("pkg", pkg);

app.get("/", (req, res) => {
  res.json({
    name: app.get("pkg").name,
    author: app.get("pkg").author,
    description: app.get("pkg").description,
  });
});

app.use('/movies',moviesRoutes);
app.use('/auth',authRoutes);
app.use('/users',userRoutes);

app.use(morgan("dev"));

export default app;
