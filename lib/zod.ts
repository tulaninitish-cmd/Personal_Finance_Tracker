import { z } from "zod";

// 1. User Registration Schema
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});





export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
// export type TransactionInput = z.infer<typeof transactionSchema>;




const TransactionType = z.enum(["income", "expense", "savings"]);


export const transactionSchema = z.object({
  amount: z.coerce.number().min(1, "Please enter an amount"), 
  type: TransactionType,
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(), 
});

// This "label" makes sure your JS objects match these rules
export type TransactionFormValues = z.infer<typeof transactionSchema>;