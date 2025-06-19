import app from "./app";
import { config } from "./config/config";
import connectDB from "./db/dbConn";

const startServer = async () => {
    connectDB();
    app.listen(config.PORT, () => {
        console.log("Server listening on PORT: ", config.PORT);
    });
};

startServer();
