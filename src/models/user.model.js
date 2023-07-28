import db from "../database";

const usersRef = db.collection("users");

export const dbCreateUser = async (user) => {
  const newUser = await usersRef.add(user);
  return { id: newUser.id, ...user };
};

export const dbGetUserByEmail = async (email) => {
  const query = await usersRef.where("email", "==", email).get();
  if (query.empty) {
    return null;
  }
  const user = query.docs[0].data();
  return { id: query.docs[0].id, ...user };
};

export default usersRef;
