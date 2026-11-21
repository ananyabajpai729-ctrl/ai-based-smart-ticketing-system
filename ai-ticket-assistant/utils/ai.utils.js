import { createAgent, gemini } from "@inngest/agent-kit";

export const analyzeTicket = async (ticket) => {
    const supportAgent = createAgent({
        model: gemini({
            model: "gemini-3.8-flash",
            apiKey: process.env.GEMINI_API_KEY,
            defaultParameters: {
                generationConfig: {
                    thinkingConfig: {
                        thinkingLevel: "LOW"
                    },
                    maxOutputTokens: 800
                }
            }
        }),
        name: "AI Ticket Triage Assistant",
        system: `You are an AI assistant that analyses technical support tickets.

Return only a valid JSON object with these fields:
- priority: "low", "medium", or "high"
- helpfulNotes: concise, practical guidance for a human moderator
- relatedSkills: an array of relevant technical skills

Do not include markdown or code fences.`
    });

    const response = await supportAgent.run(`
        Analyse this technical support ticket.

        Title: ${ticket.title}
        Description: ${ticket.description}

        Return only the requested JSON object.
    `);

    const raw = response.output[0].content;

    try {
        const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
        const jsonString = match ? match[1] : raw.trim();

        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Failed to parse AI response:", error.message);
        throw error;
    }
};
