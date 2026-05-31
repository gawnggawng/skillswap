import OpenAI from "openai";

const deepseek = new OpenAI({
  baseURL: "https://api.deepseek.com/v1",
  apiKey: process.env.DEEPSEEK_API_KEY!,
});

export async function extractSkillTags(description: string): Promise<string[]> {
  const response = await deepseek.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content:
          "Extract a list of skill tags from the following text. Return ONLY a JSON array of lowercase, hyphenated strings. Maximum 5 tags.",
      },
      { role: "user", content: description },
    ],
    max_tokens: 200,
    temperature: 0.1,
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0]?.message.content || "{}");
  return Array.isArray(result.tags) ? result.tags : Array.isArray(result) ? result : [];
}

export async function generateMatchExplanation(
  teacherName: string,
  skillTag: string,
  wantedTag: string,
  timeDescription: string
): Promise<string> {
  const response = await deepseek.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content:
          "Write a one-sentence explanation (max 150 chars) why these two users would be a good skill swap match.",
      },
      {
        role: "user",
        content: `Teacher: ${teacherName} teaches ${skillTag}. Learner wants to learn ${wantedTag}. Overlap: ${timeDescription}`,
      },
    ],
    max_tokens: 150,
    temperature: 0.5,
  });

  return response.choices[0]?.message.content || "";
}

export async function moderateTranscript(transcript: string): Promise<{
  safe: boolean;
  reason?: string;
}> {
  const response = await deepseek.chat.completions.create({
    model: "deepseek-chat",
    messages: [
      {
        role: "system",
        content:
          'Analyze the following transcript excerpt. Classify as either "SAFE" or "FLAG". FLAG if it contains: harassment, hate speech, commercial solicitation, explicit content, or spam. Respond only with SAFE or FLAG followed by a brief reason if FLAG.',
      },
      { role: "user", content: transcript },
    ],
    max_tokens: 100,
    temperature: 0,
  });

  const result = response.choices[0]?.message.content || "SAFE";
  const isFlagged = result.startsWith("FLAG");
  const reason = isFlagged ? result.replace("FLAG ", "").trim() : undefined;

  return { safe: !isFlagged, reason };
}
