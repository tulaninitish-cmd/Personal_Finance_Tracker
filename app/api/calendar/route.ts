import { NextResponse } from "next/server";
import Transaction from "@/models/Transaction";
import connectToDatabase from "@/lib/db";
import mongoose from "mongoose";

// Updated API logic to support yearly data
export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const year = parseInt(searchParams.get("year") || "");
    const mode = searchParams.get("mode"); // "month" or "year"

    if (!userId || isNaN(year)) return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });

    const userObjId = new mongoose.Types.ObjectId(userId);

    if (mode === "year") {
      // Aggregate monthly totals for the entire year
      const yearlyStats = await Transaction.aggregate([
        { $match: { 
            userId: userObjId, 
            date: { $gte: new Date(year, 0, 1), $lte: new Date(year, 11, 31, 23, 59, 59) } 
        } },
        { $group: {
            _id: { $month: "$date" },
            income: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
            expense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } },
            savings: { $sum: { $cond: [{ $eq: ["$type", "savings"] }, "$amount", 0] } }
        } },
        { $sort: { "_id": 1 } }
      ]);
      return NextResponse.json(yearlyStats);
    }

    // Default: Return month transactions
    const month = parseInt(searchParams.get("month") || "0");
    const transactions = await Transaction.find({
      userId: userObjId,
      date: { $gte: new Date(year, month, 1), $lte: new Date(year, month + 1, 0, 23, 59, 59) }
    }).sort({ date: 1 });

    return NextResponse.json(transactions);
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}