import db from "../database";

const usersRef = db.collection("roles");

export const dbNumberRoles = async () => {
  const docsSnapshot = await usersRef.get();
  const numberRoles = docsSnapshot.size;
  return numberRoles;
};

export const dbCreateRole = async (role) => {
  const newRole = await usersRef.add(role);
  return { id: newRole.id, ...role };
};

export default usersRef;
