import dotenv from 'dotenv';

dotenv.config();

export function env(name, defaultValue) {
    const value = process.env[name];
    if (value) return value;
    if (defaultValue) return defaultValue;
    console.log("value  ", value, "name  ", name);

    throw new Error(`Missing: process.env['${name}'].`);
}
