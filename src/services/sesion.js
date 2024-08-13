import { randomBytes } from "node:crypto"
import { ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_LIFETIME } from "../constants/index.js";
import Session from "../db/models/Session.js"

export const findSession = session => Session.findOne(session)

export const createSession = async (userId) => {
    const existingSession = await Session.findOne({ userId });
    if (existingSession && existingSession.refreshTokenValidUntil > new Date()) {
        throw new Error("Active session already exists");
    }

    const accessToken = randomBytes(30).toString("base64");
    const refreshToken = randomBytes(30).toString("base64");

    const accessTokenValidUntil = new Date(Date.now() + ACCESS_TOKEN_LIFETIME);
    const refreshTokenValidUntil = new Date(Date.now() + REFRESH_TOKEN_LIFETIME);

    return Session.create({
        userId,
        accessToken,
        refreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil
    });
}

