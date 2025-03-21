import { generateContent } from '@/services/gemini';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { review, place } = req.body;
    
    // Construct a prompt that uses the user review and place details.
    const prompt = `
        The user provided the following review: "${review}"
        and the following place details: ${JSON.stringify(place)}. This location resource was recommended to the user based on their 
        background and scenario.
        Based on the user's background and the emergency scenario (they are an evacuee of an immediate/recent fire hazard and damage),
        generate an explanation why this amenity was selected. Please be concise and informative. The goal here is transparency
        behind AI decisions to human users.
    `;
    
    // Use Gemini AI wrapper
    const explanation = await generateContent(prompt);
    
    return res.status(200).json({ explanation });
  } catch (error) {
    console.error("Error generating Gemini explanation:", error);
    return res.status(500).json({ error: "Error generating explanation" });
  }
}
