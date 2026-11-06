// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextResponse } from "next/server";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");


// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { categoryData, monthlySpend, userName ,balance ,totalSavings} = body;

//     // Safety check: Ensure API Key exists
//     if (!process.env.GEMINI_API_KEY) {
//       console.error("AI Error: GEMINI_API_KEY is missing in .env.local");
//       return NextResponse.json({ error: "API Key Configuration Error" }, { status: 500 });
//     }

//     // Safety check: Ensure there is data to analyze
//     if (!categoryData || categoryData.length === 0 || monthlySpend === 0) {
//       return NextResponse.json({ 
//         insights: "I need some transaction data to analyze! Start adding your expenses to get personalized financial advice." 
//       });
//     }

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     // const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
// //     const model = genAI.getGenerativeModel({
// //   model: "gemini-1.5-flash"
// // });
// // const model = genAI.getGenerativeModel({
// //   model: "gemini-pro",
// // });
// // const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
// // const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

// // Using the explicitly versioned model name
// // Replace your current model initialization with this:
// // const model = genAI.getGenerativeModel({ 
// //   model: "gemini-1.5-flash",
// // }, { 
// //   apiVersion: 'v1' 
// // });

    // const prompt = `
    //   You are "Spendly AI", a helpful and witty financial assistant for the app "Spendly".
    //   User Name: ${userName}
    //   Total Monthly Spend: ₹${monthlySpend.toLocaleString("en-IN")}
    //   Total Balance remaning : ₹${balance.toLocaleString("en-IN")}
    //   Total savings till now: ₹${totalSavings.toLocaleString("en-IN")}
    //   Category Breakdown: ${JSON.stringify(categoryData)}

    //   Instructions:
    //   1. Analyze which category has the highest percentage.
    //   2. Provide 3  punchy, and actionable tips to save money, Avoid basic advice like "save more" or "plan meals.
    //   3. Use the Indian Rupee symbol (₹).
    //   4. Be encouraging but honest about their spending.
    //   5. Tone: Helpful, modern, and witty.
    //   6. Important: Return ONLY plain text with line breaks and in points only (easily readble). No bolding (**), no headers (###).
    //   7.Greet the user with there name in the starting.
    //   8.Very important: always tell the user how much they can save by the end of this month , and what should they do to achieve that.
    //   9.Also give advise based on there total savings and total balance

    //   STRICT STRUCTURE TO FOLLOW:
    //   - [SUMMARY]: (One sentence analyzing their biggest category spend)
    //   - [TIP]: (Advanced tactical tip 1.not large)
    //   - [TIP]: (Advanced tactical tip 2.not large)
    //   - [TIP]: (Advanced tactical tip 3.not large)
    //   - [GOAL]: (Specific calculation: How much they can save by month-end based on their current balance and a realistic 10% cut in their top category)
    // `;


//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();

//     return NextResponse.json({ insights: text });

//   } catch (error: any) {
//     console.error("DETAILED SERVER ERROR:", error);

//     // ✅ NEW: Handle Gemini rate limit properly
//     if (error?.status === 429) {
//       const retryAfter =
//         error?.errorDetails?.find(
//           (d: any) =>
//             d["@type"] === "type.googleapis.com/google.rpc.RetryInfo"
//         )?.retryDelay || "20s";

//       return NextResponse.json(
//         {
//           error: "AI rate limit exceeded. Please try again shortly.",
//           retryAfter,
//         },
//         { status: 429 }
//       );
//     }

//     // ⛔ fallback (unchanged behavior)
//     return NextResponse.json(
//       { error: "Internal Server Error", details: error.message },
//       { status: 500 }
//     );
//   }
// }













import { GoogleGenAI } from "@google/genai"; // Only use the new SDK
import { NextResponse } from "next/server";

// 1. Initialize the client correctly
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { categoryData, monthlySpend, userName, balance, totalSavings } = body;

    // Safety checks (same as your original code)
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "API Key Missing" }, { status: 500 });
    }

    if (!categoryData || categoryData.length === 0 || monthlySpend === 0) {
      return NextResponse.json({ 
        insights: "I need more data to analyze your spending!" 
      });
    }

    // 2. Use the correct method call for the new SDK
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", // or your preferred version
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
      You are "Spendly AI", a helpful and witty financial assistant for the app "Spendly".
      User Name: ${userName}
      Total Monthly Spend: ₹${monthlySpend.toLocaleString("en-IN")}
      Total Balance remaning : ₹${balance.toLocaleString("en-IN")}
      Total savings till now: ₹${totalSavings.toLocaleString("en-IN")}
      Category Breakdown: ${JSON.stringify(categoryData)}

      Instructions:
      1. Analyze which category has the highest percentage.
      2. Provide 3  punchy, and actionable tips to save money, Avoid basic advice like "save more" or "plan meals.
      3. Use the Indian Rupee symbol (₹).
      4. Be encouraging but honest about their spending.
      5. Tone: Helpful, modern, and witty.
      6. Important: Return ONLY plain text with line breaks and in points only (easily readble). No bolding (**), no headers (###).
      7.Greet the user with there name in the starting.
      8.Very important: always tell the user how much they can save by the end of this month , and what should they do to achieve that.
      9.Also give advise based on there total savings and total balance

      STRICT STRUCTURE TO FOLLOW:
      - [SUMMARY]: (One sentence analyzing their biggest category spend)
      - [TIP]: (Advanced tactical tip 1.not large)
      - [TIP]: (Advanced tactical tip 2.not large)
      - [TIP]: (Advanced tactical tip 3.not large)
      - [GOAL]: (Specific calculation: How much they can save by month-end based on their current balance and a realistic 10% cut in their top category)
    `
            }
          ]
        }
      ]
    });

    // 3. Access the text response correctly
    const text = response.text; 

    return NextResponse.json({ insights: text });

  } catch (error: any) {
    console.error("DETAILED SERVER ERROR:", error);
    // Rate limit handling (keep your existing error logic)
    if (error?.status === 429) {
      return NextResponse.json({ error: "Rate limit hit." }, { status: 429 });
    }
    return NextResponse.json({ error: "Server Error", details: error.message }, { status: 500 });
  }
}