import { dbCreateUser, dbGetUserByEmail } from "../models/user.model";
import { encryptPassword, comparePassword } from "../libs/bcrypt.utils";
import { createToken } from "../libs/jwt.utils";
import { dbGetRoles } from "../models/role.model";

/**
 * Register a new user
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<Object>}
 * @description Register a new user
 */
export const register = async (req, res) => {
  const { email, name, password } = req.body;
  const userExists = await dbGetUserByEmail(email);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  const user = {
    email: email,
    password: await encryptPassword(password),
    name: name,
  };
  const role = await dbGetRoles(["user"]);
  user.roles = [role[0].ref];
  const newUser = await dbCreateUser(user);
  const token = createToken({ id: newUser.id });
  return res.status(200).json({
    token,
    user: {
      ...newUser,
      password: undefined,
      roles: ["user"],
    },
  });
};

/**
 * Register a new user with roles
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<Object>}
 * @description Register a new user with roles
 */
export const registerAdmin = async (req, res) => {
  const { email, name, password, roles } = req.body;
  const userExists = await dbGetUserByEmail(email);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  const user = {
    email: email,
    password: await encryptPassword(password),
    name: name,
  };
  if (roles) {
    const foundRoles = await dbGetRoles(roles);
    if (foundRoles.length === 0) {
      return res.status(400).json({ message: "Roles not found" });
    }
    user.roles = foundRoles.map((role) => role.ref);
  } else {
    const role = await dbGetRoles(["user"]);
    user.roles = [role[0].ref];
  }

  const newUser = await dbCreateUser(user);
  const token = createToken({ id: newUser.id });
  return res.status(200).json({
    token,
    user: {
      ...newUser,
      password: undefined,
      roles: newUser.roles.map((role) => role.id),
    },
  });
};

/**
 * Login user
 * @param {Object} req
 * @param {Object} res
 * @returns {Promise<Object>}
 * @description Login user
 */
export const login = async (req, res) => {
  const body = req.body;
  const user = await dbGetUserByEmail(body.email);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const validPassword = await comparePassword(body.password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: "Invalid password" });
  }
  const token = createToken({ id: user.id });
  return res.status(200).json({
    token,
    user: {
      ...user,
      password: undefined,
    },
  });
};
