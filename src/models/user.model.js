import { db } from "../database";

const usersRef = db.collection("users");

/**
 * Create user in firestore
 * @param {Object} user
 * @returns {Promise<Object>}
 * @description Create user in firestore
 */
export const dbCreateUser = async (user) => {
  const newUser = await usersRef.add(user);
  return { id: newUser.id, ...user };
};

/**
 * Get user by email from firestore
 * @param {string} email
 * @returns {Promise<Object> | null}
 * @description Get user by email from firestore
 */
export const dbGetUserByEmail = async (email) => {
  const query = await usersRef.where("email", "==", email).get();
  if (query.empty) {
    return null;
  }
  const user = query.docs[0].data();
  return { id: query.docs[0].id, ...user };
};

/**
 * @param {string} id
 * @returns {Promise<Object> | null}
 * @description Get user by id from firestore
 */
export const dbGetUserById = async (id) => {
  try {
    const userSnapshot = await usersRef.doc(id).get();
    if (!userSnapshot.exists) {
      return null;
    }
    const userData = userSnapshot.data();
    userData.id = userSnapshot.id;
    userData.password = null;
    if (userData.roles && Array.isArray(userData.roles)) {
      const rolesDataPromises = userData.roles.map((roleRef) => roleRef.get());
      const rolesDataSnapshots = await Promise.all(rolesDataPromises);
      const rolesData = rolesDataSnapshots.map((roleSnapshot) =>
        roleSnapshot.exists ? roleSnapshot.data().name : null
      );
      userData.roles = rolesData.filter((roleName) => roleName !== null);
    } else {
      userData.roles = [];
    }
    return userData;
  } catch (error) {
    return null;
  }
};

/**
 * @param {string} id
 * @return { Promise<Array> | null}
 * @description Get user roles by id from firestore
 */
export const dbGetUserRolesById = async (id) => {
  try {
    const userSnapshot = await usersRef.doc(id).get();
    if (!userSnapshot.exists) {
      return null;
    }
    const userData = userSnapshot.data();
    if (userData.roles && Array.isArray(userData.roles)) {
      const rolesDataPromises = userData.roles.map(async (roleRef) => {
        const roleSnapshot = await roleRef.get();
        return roleSnapshot.exists ? roleSnapshot.data().name : null;
      });
      const rolesData = await Promise.all(rolesDataPromises);
      userData.roles = rolesData.filter((roleName) => roleName !== null);
    } else {
      userData.roles = [];
    }
    return userData.roles;
  } catch (error) {
    return null;
  }
};

export default usersRef;
