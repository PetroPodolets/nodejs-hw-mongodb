import Joi from "joi";
import { email } from "../constants/index.js";

export const userRegisterSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().pattern(email),
    password: Joi.string().required(),
});

export const userLoginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
});
