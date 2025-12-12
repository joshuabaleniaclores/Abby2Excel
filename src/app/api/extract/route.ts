import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        // Securely get API key from environment variables
        const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Convert file to base64
        const buffer = await file.arrayBuffer();
        const base64Data = Buffer.from(buffer).toString("base64");

        if (!apiKey) {
            console.error("No API Key configured in environment variables.");
            // Return Mock Data if no key provided (Optional: could also return 500 error)
            // For development convenience, we keep the mock response but log the error.
            return NextResponse.json({
                mock: true,
                warning: "Using mock data. Configure GOOGLE_API_KEY in .env.local",
                data: [
                    { date: "Dec 09, 2025", qty: "10", unit: "pcs", item: "Example Item A (Mock)", drNumber: "R-0315" },
                    { date: "Dec 09, 2025", qty: "5", unit: "box", item: "Example Item B (Mock)", drNumber: "R-0315" },
                ]
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        // Use gemini-2.5-flash as requested
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
    Analyze this image of a delivery receipt or invoice.
    Extract the following information into a JSON structure:
    - Control No. (or DR#, Invoice#) -> map to 'drNumber'
    - Date -> map to 'date'
    - The table of items. For each row, extract:
        - Qty -> 'qty'
        - Unit -> 'unit'
        - Item Description -> 'item'
        - Note/Remarks -> 'remarks' (optional)
        - Received By -> 'receivedBy' (optional)
    
    Return a JSON object with a key 'items' which is an array of objects.
    Each object should have: date, qty, unit, item, drNumber, remarks, receivedBy.
    Propagate the header Date and Control No. to every item row.
    Format the date as "MMM DD, YYYY" if possible.
    Output ONLY valid JSON.
    `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Data,
                    mimeType: file.type
                }
            }
        ]);

        const responseText = result.response.text();
        // Clean up markdown code blocks if present
        const jsonString = responseText.replace(/```json\n?|\n?```/g, "").trim();

        try {
            const data = JSON.parse(jsonString);
            return NextResponse.json({ data: data.items });
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError, "Response:", responseText);
            return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
        }

    } catch (error: any) {
        console.error("Extraction error:", error);
        return NextResponse.json({
            error: error.message || "Failed to process image",
            details: error.toString()
        }, { status: 500 });
    }
}
