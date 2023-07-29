import jwt from "jsonwebtoken";
import env from "../config";

/**
 * Create a jwt token
 * 
 * @param object payload
 * @returns string
 */
export const createToken = (payload) => {
  const token = jwt.sign(payload, env.secret, {
    expiresIn: 86400,
  });
  return token;
};

/**
 *  Verify if the jwt token is valid
 *
 * @param string token
 * @returns boolean | object
 */
export const verifyToken = async (token) => {
  try {
    const decoded = jwt.verify(token, env.secret);
    return decoded;
  } catch (error) {
    return false;
  }
};
