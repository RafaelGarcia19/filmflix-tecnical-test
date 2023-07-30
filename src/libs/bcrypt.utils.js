import bcrypt from "bcryptjs";

/**
 * Encrypt password
 * @param {string} password
 * @returns {Promise<string>}
 * @description Encrypt password
 */
export const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

/**
 * Compare password
 * @param {string} password
 * @param {string} receivedPassword
 * @returns {Promise<boolean>}
 * @description Compare password
 */
export const comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword);
};
