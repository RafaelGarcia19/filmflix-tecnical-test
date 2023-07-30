import { dbNumberRoles, dbCreateRole, dbGetRoles } from "../models/role.model";
import { dbCreateUser, dbGetUserByEmail } from "../models/user.model";
import { encryptPassword } from "./bcrypt.utils";

/**
 * Create roles if not exists in database
 * @returns {Promise<void>}
 * @description Create roles if not exists in database
 */
export const createRoles = async () => {
  try {
    const count = await dbNumberRoles();
    if (count > 0) return;

    const values = await Promise.all([
      dbCreateRole({ name: "user" }),
      dbCreateRole({ name: "administrador" }),
    ]);
    console.log({roles: values});
  } catch (error) {
    console.log(error);
  }
};

/**
 * Create user admin if not exists in database
 * @returns {Promise<void>}
 * @description Create user admin if not exists in database
 */
export const createAdmin = async () => {
  try {
    const user = await dbGetUserByEmail("admin@example.com");
    if (user) return;
    const admin = {
      email: "admin@example.com",
      name: "admin",
      password: await encryptPassword("admin"),
    };
    const foundRoles = await dbGetRoles(["administrador", "user"]);
    admin.roles = foundRoles.map((role) => role.ref);
    const newAdminUser = await dbCreateUser(admin);
    console.log({
      adminUser: {
        ...newAdminUser,
        password: 'admin',
        roles: ["administrador", "user"],
      },
    });
  } catch (error) {
    console.log(error);
  }
};
