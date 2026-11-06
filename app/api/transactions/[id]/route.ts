import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Transaction from "@/models/Transaction";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectToDatabase();
    const { id } = await params;

    const txToDelete = await Transaction.findById(id);
    if (!txToDelete) return NextResponse.json({ error: "Transaction not found" }, { status: 404 });

    const allTx = await Transaction.find({ userId: txToDelete.userId });

    if (txToDelete.type === "income") {
      const currentBalance = allTx.reduce((acc, tx) => {
        if (tx.type === "income") return acc + tx.amount;
        if (tx.type === "expense" && tx.source === "balance") return acc - tx.amount;
        return acc;
      }, 0);

      if (currentBalance - txToDelete.amount < 0) {
        return NextResponse.json({ 
          error: "Cannot delete income. You have already spent these income." 
        }, { status: 400 });
      }
    }

    if (txToDelete.type === "savings") {
      const savingsBalance = allTx.reduce((acc, tx) => {
        if (tx.type === "savings") return acc + tx.amount;
        if (tx.type === "expense" && tx.source === "savings") return acc - tx.amount;
        return acc;
      }, 0);

      if (savingsBalance - txToDelete.amount < 0) {
        return NextResponse.json({ 
          error: "Cannot delete this deposit. You have already spent these savings." 
        }, { status: 400 });
      }
    }

    await Transaction.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}