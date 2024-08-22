import dotenv from "dotenv";

dotenv.config();

const _config = {
    PORT: process.env.PORT,
};

export const config = Object.freeze(_config);
