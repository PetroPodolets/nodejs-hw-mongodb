import createHttpError from "http-errors";
import { deleteSession, findUser, register, requestResetToken, resetPassword } from "../services/auth.js";
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

        await deleteSession(sessionId);

        const newSession = await createSession(currentSession.userId);

        setupResponseSession(res, newSession);

        res.status(200).json({
            status: 200,
            message: "Successfully refreshed a session!",
            data: {
                accessToken: newSession.accessToken,
            }
        });
    } catch (error) {
        next(error);
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


export const requestResetEmailController = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) {
            return next(createHttpError(400, 'Email is required'));
        }

        await requestResetToken(email);

        res.status(200).json({
            status: 200,
            message: 'Reset password email has been successfully sent.',
            data: {},
        });
    } catch (error) {
        next(error);
    }
};


export const resetPasswordController = async (req, res, next) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return next(createHttpError(400, "Token and new password are required"));
        }

        await resetPassword({ token, password });

        res.status(200).json({
            status: 200,
            message: 'Password has been successfully reset.',
            data: {},
        });
    } catch (error) {
        next(error);
    }
};

