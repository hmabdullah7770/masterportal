import mongoose from "mongoose";

// Define schema and set collection name to "masterportal"
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
  },
  { collection: "masterportal" } // <-- collection name
);

// Export the model
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
