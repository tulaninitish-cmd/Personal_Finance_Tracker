"use client";

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={12}
      toastOptions={{
        duration: 3000, 
        style: {
         
          background: "#1e293b",
          color: "#fff",
          padding: "16px 24px",
          borderRadius: "20px",
          fontSize: "14px",
          fontWeight: "600",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)",
        },
        success: {
          iconTheme: {
            primary: "#33cc33", 
            secondary: "#1e293b",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444", 
            secondary: "#fff",
          },
        },
      }}
    />
  );
}