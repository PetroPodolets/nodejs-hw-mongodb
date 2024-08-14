import createHttpError from "http-errors";
import { deleteSession, findUser, register } from "../services/auth.js";
import { hashCompare } from "../utils/hash.js";
import { createSession, findSession } from "../services/sesion.js";

const setupResponseSession = (res, { refreshToken, refreshTokenValidUntil, _id }) => {
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: refreshTokenValidUntil,
    });

    res.cookie("sessionId", _id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: refreshTokenValidUntil,
    });

}

export const registerController = async (req, res, next) => {
    try {

        const { email } = req.body;
        const user = await findUser({ email });
        if (user) {
            return next(createHttpError(409, "Email in use"));
        }
        const newUser = await register(req.body);

        const data = {
            name: newUser.name,
            email: newUser.email,
        };

        res.status(201).json({
            status: 201,
            message: "Successfully registered a user!",
            data,
        });
    } catch (error) {
        next(error);
    }
}



export const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await findUser({ email });
        if (!user) {
            return next(createHttpError(404, "Email not found"));
        }
        console.debug(`User ID: ${user._id}`);

        const passwordCompare = await hashCompare(password, user.password);

        if (!passwordCompare) {
            return next(createHttpError(401, "Password invalid"));
        }

        const session = await createSession(user._id);

        setupResponseSession(res, session);

        res.status(200).json({
            status: 200,
            message: "Successfully logged in a user!",
            data: {
                accessToken: session.accessToken,
            }
        });
    } catch (error) {
        next(error);
    }
};

export const refreshController = async (req, res, next) => {
    try {
        const { refreshToken, sessionId } = req.cookies;

        if (!refreshToken || !sessionId) {
            return next(createHttpError(401, "Session or refresh token missing"));
        }

        const currentSession = await findSession({ _id: sessionId, refreshToken });
        if (!currentSession) {
            return next(createHttpError(401, "Session not found"));
        }

        const refreshTokenExpired = Date.now() > currentSession.refreshTokenValidUntil;
        if (refreshTokenExpired) {
            return next(createHttpError(401, "Session expired"));
        }

        // Видаляємо існуючу сесію
        await deleteSession(sessionId);

        // Створюємо нову сесію
        const newSession = await createSession(currentSession.userId);

        // Налаштовуємо відповідь з новою сесією
        setupResponseSession(res, newSession);

        res.status(200).json({
            status: 200,
            message: "Successfully refreshed a session!",
            data: {
                accessToken: newSession.accessToken,
            }
        });
    } catch (error) {
        next(error); // Обробка помилок через middleware
    }
};


export const logoutController = async (req, res) => {
    const { sessionId } = req.cookies;
    if (!sessionId) {
        throw createHttpError(401, "Session not found");
    }

    await deleteSession({ _id: sessionId });

    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");

    res.status(204).send();
}
