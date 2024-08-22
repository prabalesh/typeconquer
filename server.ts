import app from "./backend/app";
import { config } from "./backend/config/config";

const startServer = async () => {
    app.listen(config.PORT, () => {
        console.log("Server listening on PORT: ", config.PORT);
    });
};

startServer();
