import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true 
    },
    icon: { 
      type: String, // Store Lucide icon name, e.g., "Utensils"
      default: "Tag" 
    },
    color: { 
      type: String, // Hex code for UI colors, e.g., "#F59E0B"
      default: "#64748b" 
    },
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      default: null // null means it's a "Default" category available to all
    }
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model("Category", CategorySchema);