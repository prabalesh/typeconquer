import dotenv from "dotenv";

dotenv.config();

const _config = {
    PORT: process.env.PORT,
    MONGO_CONN_STRING: process.env.MONGO_CONN_STRING as string,
};

export const config = Object.freeze(_config);
