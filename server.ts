import app from "./backend/app";
import { config } from "./backend/config/config";
import connectDB from "./backend/db/dbConn";

const startServer = async () => {
    connectDB();
    app.listen(config.PORT, () => {
        console.log("Server listening on PORT: ", config.PORT);
    });
};

startServer();
