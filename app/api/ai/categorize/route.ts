// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextResponse } from "next/server";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// // app/api/ai/categorize/route.ts

// export async function POST(req: Request) {
//   try {
//     const { description } = await req.json();

//     // OPTION A: Try this first (Standard name)
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // OPTION B: If A fails, replace the line above with:
//     // const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//     const prompt = `
//   You are an expert financial assistant for "Spendly", specialized in Indian and Punjabi transaction context.
//   Your goal is to categorize an expense description into exactly ONE of these categories:
//   Food & Drinks, Shopping, Transport, Enjoyment, Bills.

//   ### Context for Local Terms:
//   - "Kirana", "Dukan", "Sabzi", "Mandi", "Milk", "Doodh" -> Food & Drinks
//   - "Riksha", "Auto", "Petrol", "Diesel", "Bus fare" -> Transport
//   - "Bijli", "Recharge", "Wifi", "Water bill" -> Bills
//   - "Suit", "Kapde", "Mall", "Amazon", "Flipkart" -> Shopping
//   - "Movie", "Party", "Mela", "Gift" -> Enjoyment

//   ### Task:
//   Categorize this description: "${description}"

//   ### Rules:
//   - Return ONLY the category name.
//   - Do not provide any explanation.
//   - If it is a local Indian term, use the logic provided above.
// `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response; // Ensure you await the response object
//     const category = response.text().trim();

//     return NextResponse.json({ category });
//   } catch (error: any) {
//     console.error("AI Error Details:", error.message);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }






// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   let description = "";

//   try {
//     const body = await req.json();
//     description = body.description || "";

//     if (!description) return NextResponse.json({ category: "Food & Drinks" });

//     // Use the official Inference API endpoint
//     const API_URL =
//       "https://api-inference.huggingface.co/models/facebook/bart-large-mnli";

//     const response = await fetch(API_URL, {
//       headers: {
//         Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//       method: "POST",
//       body: JSON.stringify({
//         inputs: description,
//         parameters: {
//           candidate_labels: [
//             "Food & Drinks",
//             "Shopping",
//             "Transport",
//             "Enjoyment",
//             "Bills",
//           ],
//         },
//         options: {
//           wait_for_model: true,
//         },
//       }),
//     });

//     // Read raw text first to make debugging easier when HF returns non-JSON
//     const raw = await response.text();
//     let result: any;
//     try {
//       result = raw ? JSON.parse(raw) : {};
//     } catch (err) {
//       throw new Error(`Invalid JSON from Hugging Face: ${raw}`);
//     }

//     if (!response.ok) {
//       throw new Error(result.error || `HF inference error: ${response.status}`);
//     }

//     // Hugging Face zero-shot returns `labels` array. Also tolerate single `label`.
//     if (result.labels && result.labels.length > 0) {
//       return NextResponse.json({ category: result.labels[0] });
//     }

//     if (result.label) {
//       return NextResponse.json({ category: result.label });
//     }

//     // If no label found, include result in thrown error for easier debugging
//     throw new Error(result.error || `AI Prediction Failed: ${raw}`);
//   } catch (error: any) {
//     console.error("AI Error:", error.message);

//     // Last resort fallback (only if internet is totally down)
//     return NextResponse.json({ category: "Food & Drinks" });
//   }
// }












import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const description = (body.description || "").toLowerCase();

    const response = await fetch("https://app.fina.money/api/resource/categorize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "fina-api-test",
        "x-api-model": "v1",
      },
      body: JSON.stringify([description]),
    });

    const categories = await response.json();
    const predicted = ((categories?.[0] ?? "") as string).toLowerCase();

    console.log("AI predicted:", predicted);

    const text = `${description} ${predicted}`;

    // 🔥 STRONG BILL DETECTION (highest priority)
    if (
      text.includes("bill") ||
      text.includes("recharge") ||
      text.includes("mobile") ||
      text.includes("airtel") ||
      text.includes("jio") ||
      text.includes("vi") ||
      text.includes("telecom") ||
      text.includes("wifi") ||
      text.includes("internet") ||
      text.includes("electric") ||
      text.includes("bijli") ||
      text.includes("gas") ||
      text.includes("water") ||
      text.includes("subscription")
    ) {
      return NextResponse.json({ category: "Bills" });
    }

    // 🚕 Transport
    if (
      text.includes("transport") ||
      text.includes("travel") ||
      text.includes("bus") ||
      text.includes("train") ||
      text.includes("taxi") ||
      text.includes("auto") ||
      text.includes("uber") ||
      text.includes("ola") ||
      text.includes("petrol") ||
      text.includes("diesel")
    ) {
      return NextResponse.json({ category: "Transport" });
    }

    // 🍔 Food
    if (
      text.includes("food") ||
      text.includes("restaurant") ||
      text.includes("drink") ||
      text.includes("zomato") ||
      text.includes("swiggy") ||
      text.includes("dinner") ||
      text.includes("lunch")
    ) {
      return NextResponse.json({ category: "Food & Drinks" });
    }

    // 🛍️ Shopping
    if (
      text.includes("shop") ||
      text.includes("shopping") ||
      text.includes("cloth") ||
      text.includes("clothes") ||
      text.includes("amazon") ||
      text.includes("flipkart") ||
      text.includes("mall") ||
      text.includes("purchase")
    ) {
      return NextResponse.json({ category: "Shopping" });
    }

    // 🎬 Enjoyment (ONLY real entertainment)
    if (
      text.includes("movie") ||
      text.includes("cinema") ||
      text.includes("party") ||
      text.includes("game") ||
      text.includes("concert")
    ) {
      return NextResponse.json({ category: "Enjoyment" });
    }

    // 🧠 SAFE DEFAULT
    return NextResponse.json({ category: "Bills" });

  } catch (error: any) {
    console.error("AI Error:", error.message);
    return NextResponse.json({ error: "AI Failed" }, { status: 500 });
  }
}










// import { NextResponse } from "next/server";

// const HF_API_KEY = process.env.HF_API_KEY!;

// const MODEL_URL =
//   "https://router.huggingface.co/hf-inference/models/valhalla/distilbart-mnli-12-1";

// export async function POST(req: Request) {
//   try {
//     const { description } = await req.json();

//     if (!description || description.length < 2) {
//       return NextResponse.json({ category: null });
//     }

//     const response = await fetch(MODEL_URL, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${HF_API_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         inputs: description,
//         parameters: {
//           candidate_labels: [
//             "Food & Drinks (burger, pizza, milk, groceries, snacks, restaurant food)",
//             "Shopping (clothes, electronics, online purchases)",
//             "Transport (bus fare, taxi, fuel, travel)",
//             "Enjoyment (movies, parties, games, entertainment)",
//             "Bills (mobile recharge, electricity, internet, utilities)"
//           ],
//           hypothesis_template:
//             "This expense transaction is for {}.",
//         },
//       }),
//     });

//     const result = await response.json();

//     const best = Array.isArray(result) ? result[0] : null;

//     if (!best?.label) {
//       return NextResponse.json({ category: "Bills" });
//     }

//     const category = best.label.split(" (")[0];

//     return NextResponse.json({ category });

//   } catch (error: any) {
//     console.error("AI categorization error:", error.message);
//     return NextResponse.json(
//       { error: "AI categorization failed" },
//       { status: 500 }
//     );
//   }
// }
