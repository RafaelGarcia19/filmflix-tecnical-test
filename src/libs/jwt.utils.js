import jwt from "jsonwebtoken";
import env from "../config";

export const createToken = (payload) => {
  const token = jwt.sign(payload, env.secret, {
    expiresIn: 86400,
  });
  return token;
};
