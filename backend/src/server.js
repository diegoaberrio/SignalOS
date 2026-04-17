import app from "./app.js";
import { env } from "./config/env.js";
import { testDatabaseConnection } from "./config/db.js";

const startServer = async () => {
  try {
    const dbStatus = await testDatabaseConnection();
    console.log("PostgreSQL connected successfully:", dbStatus);

    app.listen(env.port, () => {
      console.log(
        `SignalOS backend running on http://localhost:${env.port} in ${env.nodeEnv} mode`
      );
    });
  } catch (error) {
    console.error("Failed to connect to PostgreSQL:", error.message);
    process.exit(1);
  }
};

startServer();