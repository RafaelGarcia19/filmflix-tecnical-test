import { dbCreateUser, dbGetUserByEmail } from "../models/user.model";
import { encryptPassword } from "../libs/bcrypt.utils";
import { createToken } from "../libs/jwt.utils";

export const register = async (req, res) => {
  const body = req.body;
  const userExists = await dbGetUserByEmail(body.email);
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }
  const user = {
    email: body.email,
    password: await encryptPassword(body.password),
    name: body.name,
  };
  const newUser = await dbCreateUser(user);
  const token = createToken({ id: newUser.id });
  return res.status(200).json({
    token,
    user: {
     ...newUser,
     password: undefined
    },
  });
};
