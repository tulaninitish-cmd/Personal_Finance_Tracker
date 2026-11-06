import { NextResponse } from "next/server";
import connectDB from "@/lib/db"; // Ensure this path matches your DB config
import User from "@/models/User"; // Ensure this path matches your User model

export async function PUT(req: Request) {
  try {
    await connectDB(); // Establish connection to financeTracker DB

    const { userId, name } = await req.json();

    if (!userId || !name) {
      return NextResponse.json(
        { error: "User ID and Name are required" },
        { status: 400 }
      );
    }

    // Update the user document in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name: name.trim() },
      { new: true } // Returns the updated document
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Profile updated successfully", name: updatedUser.name },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("UPDATE_PROFILE_ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}