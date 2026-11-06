

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Transaction, { TransactionSource, TransactionType } from "@/models/Transaction";
import mongoose from "mongoose";




export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    
    const { userId, amount, type, category, description, date, source } = body;

    if (!userId || !amount || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const transactionDate = date ? new Date(date) : new Date();
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    if (transactionDate < startOfCurrentMonth) {
      return NextResponse.json(
        { error: "You cannot add expenses from previous months." },
        { status: 400 }
      );
    }

    if (transactionDate > endOfToday) {
      return NextResponse.json(
        { error: "You cannot add expenses for a future date." },
        { status: 400 }
      );
    }

    let transactionSource = source || TransactionSource.BALANCE;

    if (type === TransactionType.SAVINGS) {
      transactionSource = TransactionSource.SAVINGS;
    }

    const newTransaction = await Transaction.create({
      userId: new mongoose.Types.ObjectId(userId),
      amount: Number(amount),
      type,
      source: transactionSource,
      category: category || "Other",
      description,
      date: transactionDate,
    });

    return NextResponse.json({ 
      message: "Transaction added successfully", 
      data: newTransaction 
    }, { status: 201 });

  } catch (error: any) {
    console.error("POST Transaction Error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}





// export async function GET(req: Request) {
//   try {
//     await connectToDatabase();

//     const { searchParams } = new URL(req.url);
//     const userId = searchParams.get("userId");
    
//     const page = parseInt(searchParams.get("page") || "1");
//     const searchQuery = searchParams.get("search") || "";
//     const categoriesQuery = searchParams.get("categories") || "";
//     const typesQuery = searchParams.get("types") || ""; // NEW: Get types from query
//     const allTime = searchParams.get("allTime") === "true";
//     const monthStr = searchParams.get("month"); 
    
//     const limit = 10;
//     if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

//     const query: any = { userId: new mongoose.Types.ObjectId(userId) };

//     if (searchQuery) {
//       query.description = { $regex: searchQuery, $options: "i" };
//     }

//     if (categoriesQuery) {
//       query.category = { $in: categoriesQuery.split(",") };
//     }

//     // NEW: Filter by Transaction Types (income, savings, expense)
//     if (typesQuery) {
//       query.type = { $in: typesQuery.split(",") };
//     }

//     if (!allTime && monthStr) {
//       const [year, month] = monthStr.split("-").map(Number);
//       const startDate = new Date(year, month - 1, 1);
//       const endDate = new Date(year, month, 0, 23, 59, 59, 999);
//       query.date = { $gte: startDate, $lte: endDate };
//     }

//     const skipCount = (page - 1) * limit;

//     const [transactions, totalCount] = await Promise.all([
//       Transaction.find(query)
//         .sort({ date: -1, createdAt: -1 })
//         .skip(skipCount)
//         .limit(limit),
//       Transaction.countDocuments(query),
//     ]);

//     return NextResponse.json({
//       transactions,
//       currentPage: page,
//       totalPages: Math.ceil(totalCount / limit),
//       totalTransactions: totalCount,
//     });
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
//   }
// }




export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    const page = parseInt(searchParams.get("page") || "1");
    const searchQuery = searchParams.get("search") || "";
    const categoriesQuery = searchParams.get("categories") || "";
    const typesQuery = searchParams.get("types") || ""; 
    const allTime = searchParams.get("allTime") === "true";
    const monthStr = searchParams.get("month"); 
    
    const limit = 10;
    if (!userId) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    const query: any = { userId: new mongoose.Types.ObjectId(userId) };

    if (searchQuery) {
      query.description = { $regex: searchQuery, $options: "i" };
    }

    if (categoriesQuery) {
      query.category = { $in: categoriesQuery.split(",") };
    }

    if (typesQuery) {
      query.type = { $in: typesQuery.split(",") };
    }

    if (!allTime && monthStr) {
      const [year, month] = monthStr.split("-").map(Number);
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const skipCount = (page - 1) * limit;

    // ADDED: Aggregation to sum all matching expenses globally (ignoring limit/skip)
    const [transactions, totalCount, stats] = await Promise.all([
      Transaction.find(query)
        .sort({ date: -1, createdAt: -1 })
        .skip(skipCount)
        .limit(limit),
      Transaction.countDocuments(query),
      Transaction.aggregate([
        { $match: { ...query, type: "expense" } }, // Match filters but only for expenses
        { $group: { _id: null, total: { $sum: "$amount" } } }
      ])
    ]);

    // Extract the global total from aggregation results
    const totalFilteredAmount = stats.length > 0 ? stats[0].total : 0;

    return NextResponse.json({
      transactions,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalTransactions: totalCount,
      totalFilteredAmount, // NEW: Now available for your Global Total Card
    });
  } catch (error) {
    console.error("TRANSACTIONS_GET_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}