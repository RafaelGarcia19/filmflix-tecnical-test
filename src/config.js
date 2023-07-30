import { config } from "dotenv";
// Load environment variables from .env file
config();

// Export all environment variables
export default {
  port: process.env.PORT || 3000,
  secret: process.env.JWT_SECRET || "secret",
  db: {
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'filmflix-363c0.appspot.com' ,
  },
};
