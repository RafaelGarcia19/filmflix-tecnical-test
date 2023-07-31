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

/**
 * Add movie to liked movies
 * @param { Array<object> } movieRefs
 * @param { string } userId
 * @returns { Promise<boolean> }
 * @description Add movie to liked movies
 */
export const dbAddLikedMovie = async (movieRefs, userId) => {
  try {
    const userRef = usersRef.doc(userId);
    const userSnapshot = await userRef.get();
    if (!userSnapshot.exists) {
      return false;
    }
    const user = userSnapshot.data();
    const likedMovies = user.liked_movies || [];
    if (likedMovies.find((movie) => movie.id === movieRefs.id)) {
      return false;
    }
    likedMovies.push(movieRefs);
    await userRef.update({ liked_movies: likedMovies });
    return {
      id: userSnapshot.id,
      ...user,
      liked_movies: likedMovies.map((movie) => movie.id),
    };
  } catch (error) {
    return false;
  }
};

/**
 * Remove movie from liked movies
 * @param { string } movieId
 * @param { string } userId
 * @returns { Promise<boolean> }
 * @description Remove movie from liked movies
 */
export const dbRemoveLikedMovie = async (movieId, userId) => {
  try {
    const userRef = usersRef.doc(userId);
    const userSnapshot = await userRef.get();
    if (!userSnapshot.exists) {
      return false;
    }
    const user = userSnapshot.data();
    const likedMovies = user.liked_movies || [];
    const movieIndex = likedMovies.findIndex((movie) => movie.id === movieId);
    if (movieIndex === -1) {
      return false;
    }
    likedMovies.splice(movieIndex, 1);
    await userRef.update({ liked_movies: likedMovies });
    return {
      id: userSnapshot.id,
      ...user,
      liked_movies: likedMovies.map((movie) => movie.id),
    };
  } catch (error) {
    return false;
  }
};

/**
 * Verify is user have a movie in liked_movies
 * @param { string } movieId
 * @param { string } userId
 * @returns { Promise<boolean> }
 */
export const dbIsMovieLiked = async (movieId, userId) => {
  try {
    const userRef = usersRef.doc(userId);
    const userSnapshot = await userRef.get();
    if (!userSnapshot.exists) {
      return false;
    }
    const user = userSnapshot.data();
    const likedMovies = user.liked_movies || [];
    const movieIndex = likedMovies.findIndex((movie) => movie.id === movieId);
    return movieIndex !== -1;
  } catch (error) {
    return false;
  }
};

/**
 * Get all users with roles
 * @returns { Promise<Array> }
 * @description Get all users with roles
 */
export const dbGetAllUsers = async () => {
  try {
    const usersSnapshot = await usersRef.get();
    const usersDataPromises = usersSnapshot.docs.map(async (userSnapshot) => {
      const userData = userSnapshot.data();
      userData.id = userSnapshot.id;
      userData.password = null;

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

      return userData;
    });

    const usersData = await Promise.all(usersDataPromises);
    return usersData;
  } catch (error) {
    return [];
  }
};


export default usersRef;
