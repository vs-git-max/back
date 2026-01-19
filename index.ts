//dependencies
import "dotenv/config";
//the app
import app from "./src/app.ts";

import connectDB from "./src/database/db.ts";

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
