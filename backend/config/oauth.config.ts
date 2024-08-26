import { OAuth2Client } from "google-auth-library";
import { config } from "./config";

export default new OAuth2Client(config.GOOGLE_CLIENT_ID as string);
