
// import { NextResponse } from "next/server";
// import Transaction from "@/models/Transaction";
// import mongoose from "mongoose";
// import connectToDatabase from "@/lib/db";

// export async function GET(req: Request) {
//   try {
//     await connectToDatabase();
//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");

//     if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
//       return NextResponse.json({ error: "Valid User ID required" }, { status: 400 });
//     }

//     const userObjId = new mongoose.Types.ObjectId(userId);
//     const now = new Date();
    
//     const startOf7Days = new Date();
//     startOf7Days.setDate(now.getDate() - 6);
//     startOf7Days.setHours(0,0,0,0);

//     // 1. Last 7 Days Aggregation - FIXED FORMAT
//     const last7Days = await Transaction.aggregate([
//       { $match: { userId: userObjId, date: { $gte: startOf7Days } } },
//       { $group: {
//           // Changed format to standard YYYY-MM-DD which Mongo supports
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
//           income: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
//           expense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } },
//           savings: { $sum: { $cond: [{ $eq: ["$type", "savings"] }, "$amount", 0] } },
//           rawDate: { $first: "$date" }
//       } },
//       { $sort: { rawDate: 1 } }
//     ]);

//     const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
//     const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

//     const fetchMonthly = async (start: Date, end: Date) => {
//       return await Transaction.aggregate([
//         { $match: { userId: userObjId, type: "expense", date: { $gte: start, $lte: end } } },
//         { $group: { _id: { $dayOfMonth: "$date" }, dailyTotal: { $sum: "$amount" } } },
//         { $sort: { _id: 1 } }
//       ]);
//     };

//     const thisMonthData = await fetchMonthly(startOfThisMonth, now);
//     const lastMonthData = await fetchMonthly(startOfLastMonth, endOfLastMonth);

//     const allStats = await Transaction.aggregate([
//       { $match: { userId: userObjId } },
//       { $group: { _id: "$type", total: { $sum: "$amount" } } }
//     ]);

//     return NextResponse.json({ 
//       last7Days: last7Days || [], 
//       thisMonthData: thisMonthData || [], 
//       lastMonthData: lastMonthData || [], 
//       allStats: allStats || [] 
//     });

//   } catch (error: any) {
//     console.error("API Error:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


import { NextResponse } from "next/server";
import Transaction from "@/models/Transaction";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";

export async function GET(req: Request) {
  try {
    
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Valid User ID required" }, { status: 400 });
    }

    const userObjId = new mongoose.Types.ObjectId(userId);
    const now = new Date();
    
    const startOf7Days = new Date();
    startOf7Days.setDate(now.getDate() - 6);
    startOf7Days.setHours(0,0,0,0);

    // 1. Last 7 Days Aggregation - FIXED FORMAT
    const last7Days = await Transaction.aggregate([
      { $match: { userId: userObjId, date: { $gte: startOf7Days } } },
      { $group: {
          // Changed format to standard YYYY-MM-DD which Mongo supports
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          income: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
          expense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } },
          savings: { $sum: { $cond: [{ $eq: ["$type", "savings"] }, "$amount", 0] } },
          rawDate: { $first: "$date" }
      } },
      { $sort: { rawDate: 1 } }
    ]);
const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

// NEW: Define the end of today as 23:59:59 to include late-day transactions
const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const fetchMonthly = async (start: Date, end: Date) => {
      return await Transaction.aggregate([
        { $match: { userId: userObjId, type: "expense", date: { $gte: start, $lte: end } } },
        { $group: { _id: { $dayOfMonth: "$date" }, dailyTotal: { $sum: "$amount" } } },
        { $sort: { _id: 1 } }
      ]);
    };

    // CHANGE 'now' TO 'endOfToday'
const thisMonthData = await fetchMonthly(startOfThisMonth, endOfToday); 
const lastMonthData = await fetchMonthly(startOfLastMonth, endOfLastMonth);

    const allStats = await Transaction.aggregate([
      { $match: { userId: userObjId } },
      { $group: { _id: "$type", total: { $sum: "$amount" } } }
    ]);

    return NextResponse.json({ 
      last7Days: last7Days || [], 
      thisMonthData: thisMonthData || [], 
      lastMonthData: lastMonthData || [], 
      allStats: allStats || [] 
    });

  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}