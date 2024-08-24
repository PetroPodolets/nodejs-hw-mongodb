import path from 'node:path';


export const contactList = ["work", "home", "personal"]

export const sortOrderList = ["asc", "desc"];

export const contactFieldList = [
    "_id",
    "name",
    "phoneNumber",
    "isFavourite",
    "contactType",
    "createdAt",
    "updatedAt"
];

export const email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;



export const ACCESS_TOKEN_LIFETIME = 15 * 60 * 1000;
export const REFRESH_TOKEN_LIFETIME = 30 * 24 * 60 * 60 * 1000;


export const SMTP = {
    SMTP_HOST: 'SMTP_HOST',
    SMTP_PORT: 'SMTP_PORT',
    SMTP_USER: 'SMTP_USER',
    SMTP_PASSWORD: 'SMTP_PASSWORD',
    SMTP_FROM: 'SMTP_FROM',
};


export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');



export const CLOUDINARY = {
    CLOUD_NAME: 'CLOUD_NAME',
    API_KEY: 'API_KEY',
    API_SECRET: 'API_SECRET',
};
export const SWAGGER_PATH = path.resolve('docs', 'swagger.json');
