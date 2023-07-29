import * as jwt from "../libs/jwt.utils";
import { dbGetUserById } from "../models/user.model";

/**
 * Middleware to check if the user is authenticated
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns json | next()
 */
export const isAuth = async (req, res, next) => {
  try {
    const dustToken = req.headers["authorization"];
    if (!dustToken) {
      throw new Error("No token provided");
    }

    const token = dustToken.split(" ")[1];
    const decodedToken = await jwt.verifyToken(token);

    if (!decodedToken) {
      throw new Error("Invalid Token");
    }

    const user = await dbGetUserById(decodedToken.id);

    if (!user) {
      throw new Error("User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message || "Unauthorized!" });
  }
};

/**
 * Middleware to check if the user is admin
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns json | next()
 */
export const isAdmin = async (req, res, next) => {
  try {
    const userRoles = req.user.roles;
    if (!userRoles || !userRoles.includes("administrador")) {
      throw new Error("Unauthorized! Require Admin Role");
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message || "Unauthorized!" });
  }
};
