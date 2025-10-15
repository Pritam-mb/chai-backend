// Load environment variables
import dotenv from "dotenv";
dotenv.config({ path: "../.env" }); // important since .env is outside /src
// const a = require(FileSystem)
// Import dependencies
import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import app from "./app.js";
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, () => {
        console.log(`🚀 Server running on port ${process.env.PORT || 8000}`);
      });
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
  throw err;
});






// import express from "express";

// // Initialize express app
// const app = express();

// // Debug check (optional, remove later)
// console.log("MONGO_URI:", process.env.MONGO_URI);
// console.log("PORT:", process.env.PORT);

// // Self-invoking async function to connect DB and start server
// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
//     console.log("✅ MongoDB connected successfully");

//     app.on("error", (err) => {
//       console.error("❌ Express server error:", err.message);
//     });

//     app.listen(process.env.PORT || 8000, () => {
//       console.log(`🚀 Server running on port ${process.env.PORT || 8000}`);
//     });
//   } catch (error) {
//     console.error("❌ MongoDB connection error:", error.message);
//     throw error;
//   }
// })();
