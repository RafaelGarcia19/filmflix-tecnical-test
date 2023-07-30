import app from "./app";

// Start server
app.listen(app.get("port"), () =>
  console.log(`Listening on port ${app.get("port")}!`)
);
