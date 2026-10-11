import "dotenv/config";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { connectDatabase } from "./config/database.js";
import app from "./app.js";
const port = Number(process.env.PORT) || 5000;

async function startServer() {
  await connectDatabase();
  app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error("Could not start the API:", error);
  process.exitCode = 1;
});