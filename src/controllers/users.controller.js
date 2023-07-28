import user from '../models/user.model';
export const getAllUsers = async (req, res) => {
    const docsSnapshot = await user.get();
    const users = docsSnapshot.docs.map(doc => doc.data());
    res.status(200).json(users);
};