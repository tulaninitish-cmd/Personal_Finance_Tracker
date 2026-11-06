


import { NextResponse } from "next/server";
import Transaction from "@/models/Transaction";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // 1. Convert string ID to ObjectId for aggregation
    const userObjId = new mongoose.Types.ObjectId(userId);
    const userDetails = await User.findById(userId).select("createdAt");
    
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    
    // Previous Month Dates
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    const allTransactions = await Transaction.find({ userId });

    let totalIncome = 0;
    let expensesFromBalance = 0;
    let expensesFromSavings = 0;
    let savingsDeposits = 0;
    let monthlySpend = 0;

    const categoryTotals: Record<string, number> = {
      "Food & Drinks": 0,
      "Shopping": 0,
      "Transport": 0,
      "Enjoyment": 0,
      "Bills": 0,
      "Health": 0,
      "Education": 0,
      "Personal Care": 0,
      "Miscellaneous": 0,
    };

    allTransactions.forEach((tx) => {
      const amount = tx.amount;
      if (tx.type === "income") {
        totalIncome += amount;
      } 
      else if (tx.type === "savings") {
        savingsDeposits += amount;
      } 
      else if (tx.type === "expense") {
        if (tx.source === "balance") expensesFromBalance += amount;
        else if (tx.source === "savings") expensesFromSavings += amount;

        const txDate = new Date(tx.date);
        if (txDate >= startOfThisMonth && txDate <= endOfThisMonth) {
          monthlySpend += amount;
          if (categoryTotals.hasOwnProperty(tx.category)) {
            categoryTotals[tx.category] += amount;
          }
        }
      }
    });

    const balance = totalIncome - expensesFromBalance;
    const totalSavings = savingsDeposits - expensesFromSavings;

    // 2. Fetch previous month's spending correctly
    const prevMonthSpendRes = await Transaction.aggregate([
      { $match: { 
          userId: userObjId, 
          type: "expense", 
          date: { $gte: startOfLastMonth, $lte: endOfLastMonth } 
      } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);


      


    // 3. Optional: Historical comparison for Balance/Savings
    // To calculate balance change, we subtract this month's net activity from current balance
    const thisMonthIncome = allTransactions
      .filter(tx => new Date(tx.date) >= startOfThisMonth && tx.type === "income")
      .reduce((acc, tx) => acc + tx.amount, 0);
    const prevBalance = balance - (thisMonthIncome - monthlySpend);

    // const categories = Object.keys(categoryTotals).map((key) => ({
    //   label: key,
    //   value: monthlySpend > 0 ? Math.round((categoryTotals[key] / monthlySpend) * 100) : 0
    // }));

    const categories = Object.keys(categoryTotals)
      .map((key) => ({
        label: key,
        value: monthlySpend > 0 ? Math.round((categoryTotals[key] / monthlySpend) * 100) : 0
      }))
      .filter((category) => category.value > 0);
    

    const recentTransactions = await Transaction.find({ userId }).sort({ createdAt: -1 }).limit(6);

    return NextResponse.json({
      balance,
      prevBalance, // Sent for dynamic trend calculation
      monthlySpend,
      prevMonthlySpend: prevMonthSpendRes[0]?.total || 0, // Corrected return
      totalSavings,
      categories,
      transactions: recentTransactions,
      createdAt: userDetails?.createdAt,
    }, { status: 200 });

  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}