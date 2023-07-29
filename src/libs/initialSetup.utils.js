import { dbNumberRoles, dbCreateRole } from "../models/role.model";

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
