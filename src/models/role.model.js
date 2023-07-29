import db from "../database";

const rolesRef = db.collection("roles");

export const dbNumberRoles = async () => {
  const docsSnapshot = await rolesRef.get();
  const numberRoles = docsSnapshot.size;
  return numberRoles;
};

export const dbCreateRole = async (role) => {
  const newRole = await rolesRef.add(role);
  return { id: newRole.id, ...role };
};

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
