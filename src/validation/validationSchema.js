import Joi from "joi";
import { contactList } from "../constants/index.js";

export const contactAddSchema = Joi.object({
    name: Joi.string().required().min(3).max(20),
    phoneNumber: Joi.string().required().min(3).max(20),
    email: Joi.string().email(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid(...contactList).min(3).max(20),
});

export const contactUpdateSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    phoneNumber: Joi.string().min(3).max(20),
    email: Joi.string().email(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().valid(...contactList).min(3).max(20),
})
