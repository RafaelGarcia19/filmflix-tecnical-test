import { dbNumberRoles, dbCreateRole } from "../models/role.model";

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
    console.log(values);
  } catch (error) {
    console.log(error);
  }
};
