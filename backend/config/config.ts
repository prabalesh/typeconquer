import dotenv from "dotenv";

dotenv.config();

const _config = {
    PORT: process.env.PORT,
    MONGO_CONN_STRING: process.env.MONGO_CONN_STRING as string,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    NODE_ENV: process.env.NODE_ENV as string,
    FRONTEND_URL: process.env.FRONTEND_URL as string,
};

export const config = Object.freeze(_config);
