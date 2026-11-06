
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, "Please provide a name"] 
    },
    email: { 
      type: String, 
      required: [true, "Please provide an email"], 
      unique: true,
      lowercase: true 
    },
    password: { 
      type: String, 
      required: false, // Changed to false to allow Google Sign-In
      minlength: 6
    },
    image: { 
      type: String 
    }
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);