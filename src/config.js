import { config } from "dotenv";
config();
export default {
  port: process.env.PORT || 3000,
  secret: process.env.JWT_SECRET || "secret",
};
