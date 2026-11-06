
import mongoose, { Schema, Document } from "mongoose";

export enum TransactionType {
  INCOME = "income",
  EXPENSE = "expense",
  SAVINGS = "savings",
}

export enum TransactionSource {
  BALANCE = "balance",
  SAVINGS = "savings",
}

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  type: TransactionType;
  source?: TransactionSource; 
  category: string;
  description?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },

    type: {
      type: String,
      enum: Object.values(TransactionType),
      required: true,
    },

    
    source: {
      type: String,
      enum: Object.values(TransactionSource),
      default: TransactionSource.BALANCE,
    },

    category: {
      type: String,
      required: true,
      default: "Other",
    },

    description: {
      type: String,
      maxlength: 100,
    },

    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
