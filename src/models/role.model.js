import { db } from "../database";

const rolesRef = db.collection("roles");

/**
 * Get number of roles in database
 * @returns {Promise<number>}
 * @description Get number of roles in database
 */
export const dbNumberRoles = async () => {
  const docsSnapshot = await rolesRef.get();
  const numberRoles = docsSnapshot.size;
  return numberRoles;
};

/**
 * Create a new role
 * @param {Object} role
 * @returns {Promise<Object>}
 * @description Create a new role
 */
export const dbCreateRole = async (role) => {
  const newRole = await rolesRef.add(role);
  return { id: newRole.id, ...role };
};

/**
 * Get roles by array of names
 * @param {Array<string>} roles
 * @returns {Promise<Array<Object>>}
 * @description Get roles by array of names
 */
export const dbGetRoles = async (roles) => {
  if (roles && Array.isArray(roles)) {
    const roleRefs = await Promise.all(
      roles.map(async (role) => {
        const roleQuery = await rolesRef.where("name", "==", role).get();
        if (roleQuery.empty) {
          return null;
        }
        return roleQuery.docs[0];
      })
    );
    const roleDocs = roleRefs.filter((role) => role !== null);
    return roleDocs;
  }
  return [];
};

export default rolesRef;
