import Session from "../db/models/Session.js";
import User from "../db/models/user.js";
import { hashValue } from "../utils/hash.js";

export const findUser = filter => User.findOne(filter);

export const register = async (data) => {
    const { password } = data;
    const hashPassword = await hashValue(password);
    return User.create({ ...data, password: hashPassword });
}

export const deleteSession = sessionId => Session.deleteOne({ _id: sessionId });

