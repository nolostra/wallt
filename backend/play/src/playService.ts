import { Server } from "@hapi/hapi";
import { registerPlayRoutes } from "./routes/playRoutes"; // Adjust path as needed
import { sequelize, testConnection } from "./config/db";

// Initialize Hapi server
const server: Server = new Server({
  port: 3002,
  host: "localhost",
  debug: {
    request: ["error"],
  },
  routes: {
    cors: {
      origin: ["*"], // Allow all origins, adjust as needed
      headers: ["Accept", "Authorization", "Content-Type", "If-None-Match"], // Allowed headers
      credentials: true, // Allow credentials
    },
  },
});

// Register the routes
registerPlayRoutes(server);

// Function to start the server
const init = async () => {
  try {
    await server.start();
    await testConnection();
    await sequelize.sync({ force: false }); // Synchronize models with database
    console.log(`Play Service running on port ${server.info.uri}`);
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: Error) => {
  console.error(err);
  process.exit(1);
});

// Start the server
init();

export default server;
