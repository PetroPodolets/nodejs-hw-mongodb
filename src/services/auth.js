import createHttpError from "http-errors";
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';
import bcrypt from "bcrypt"

import Session from "../db/models/Session.js";
import User from "../db/models/user.js";
import { hashValue } from "../utils/hash.js";
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';


export const findUser = filter => User.findOne(filter);


export const register = async (data) => {
    const { password } = data;
    const hashPassword = await hashValue(password);
    return User.create({ ...data, password: hashPassword });
}


export const deleteSession = sessionId => Session.deleteOne({ _id: sessionId });



export const requestResetToken = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw createHttpError(404, 'User not found');
    }

    const resetToken = jwt.sign(
        {
            sub: user._id,
            email,
        },
        env('JWT_SECRET'),
        {
            expiresIn: '15m',
        },
    );

    const resetPasswordTemplatePath = path.join(
        TEMPLATES_DIR,
        'reset-password-email.html',
    );

    const templateSource = await fs.readFile(resetPasswordTemplatePath).catch((err) => {
        throw createHttpError(500, 'Failed to load the email template.', err);
    });

    const template = handlebars.compile(templateSource.toString());
    const html = template({
        name: user.name,
        link: `${env('APP_DOMAIN')}/reset-pwd?token=${resetToken}`,
    });

    try {
        await sendEmail({
            from: env(SMTP.SMTP_FROM),
            to: email,
            subject: 'Reset your password',
            html,
        });
    } catch (err) {
        throw createHttpError(500, 'Failed to send the email, please try again later.', err);
    }
};

export const resetPassword = async (payload) => {
    let entries;

    try {
        entries = jwt.verify(payload.token, env('JWT_SECRET'));
    } catch (err) {
        throw createHttpError(401, 'Token is expired or invalid.',err);
    }

    const user = await User.findOne({
        email: entries.email,
        _id: entries.sub,
    });

    if (!user) {
        throw createHttpError(404, 'User not found');
    }

    const encryptedPassword = await bcrypt.hash(payload.password, 10);

    await User.updateOne(
        { _id: user._id },
        { password: encryptedPassword },
    );

    await Session.deleteMany({ userId: user._id });
};
