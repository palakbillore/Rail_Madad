

import dotenv from "dotenv";
dotenv.config();

const VALID_CATEGORIES = ["Cleanliness", "Damage", "Staff Behaviour", "Security", "Facilities", "Other"];
const VALID_URGENCIES = ["Low", "Medium", "High"];
const MODELS = [
  process.env.OPENROUTER_MODEL || "google/gemma-4-26b-a4b-it:free",
  "google/gemma-4-31b-it:free",
].filter((model, index, models) => models.indexOf(model) === index);

const classifyFromText = (text) => {
  const value = text.toLowerCase();
  const rules = [
    { category: "Security", urgency: "High", terms: ["fire", "smoke", "accident", "collision", "derail", "harass", "theft", "fight", "danger", "injured"] },
    { category: "Cleanliness", urgency: "Low", terms: ["dirty", "garbage", "rubbish", "unclean", "toilet", "smell", "pest", "rats"] },
    { category: "Damage", urgency: "Medium", terms: ["broken", "damaged", "cracked", "window", "seat", "door", "fan", "light"] },
    { category: "Staff Behaviour", urgency: "Medium", terms: ["staff", "rude", "tte", "bribe", "behavior", "behaviour", "misconduct"] },
    { category: "Facilities", urgency: "Medium", terms: ["water", "ac ", "air conditioning", "charging", "electricity", "power", "bedroll", "not working"] },
  ];
  const match = rules.find((rule) => rule.terms.some((term) => value.includes(term)));
  return match
    ? { category: match.category, urgency: match.urgency, confidence: 0.35, description: text.slice(0, 500) }
    : null;
};

export const categorizeComplaint = async (imageUrl, extractedText = "") => {
  const startedAt = Date.now();
  console.log(`[complaint-ai] ${new Date().toISOString()} request started`, {
    hasImage: Boolean(imageUrl),
    hasText: Boolean(extractedText),
  });
  try {
    if (!process.env.OPENROUTER_API_KEY) throw new Error("OPENROUTER_API_KEY is missing");

    const messages = [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are an expert AI system for the Indian Railways grievance management platform.
Your task is to analyze the provided image (and optional text) and categorize the passenger complaint accurately.
${extractedText ? `Additional passenger context: "${extractedText}"` : ""}

CATEGORIES:
- Cleanliness: Dirty coach, platforms, foul smell, garbage, pests, unclean toilets.
- Damage: Broken seats, windows, doors, lights, fans, minor property damage.
- Staff Behaviour: Rude staff, TTE misconduct, bribery, unhelpful personnel.
- Security: Fire, harassment, fights, theft, unauthorized persons, overcrowding, derailment, collision.
- Facilities: No water, AC malfunctioning, no bedroll, power outage, non-functional charging ports.
- Other: Anything that strictly does not fit the above categories.

URGENCY RULES:
- High: Immediate threat to life, safety, or severe operational disruption (Security, major accidents, fire).
- Medium: Discomfort or service failure but not life-threatening (Facilities, Staff Behaviour, Damage).
- Low: Minor inconveniences (Cleanliness, minor aesthetic damage).

CRITICAL PRIORITIES:
1. Derailments, collisions, or danger to human life MUST be "Security" + "High".
2. If multiple issues are present, categorize based on the MOST severe/urgent issue.

Respond only with JSON: {"category":"Cleanliness","urgency":"Low","confidence":0.95,"description":"Short summary."}`,
          },
          ...(imageUrl ? [{ type: "image_url", image_url: { url: imageUrl } }] : []),
        ],
      },
    ];

    let data;
    let response;
    let lastError;
    let selectedModel;
    for (const model of MODELS) {
      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "X-OpenRouter-Title": "Rail Madad",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model, messages, max_tokens: 500 }),
      });
      data = await response.json().catch(() => ({}));
      if (response.ok && data.choices?.length) {
        selectedModel = model;
        break;
      }

      const providerMessage = data.error?.metadata?.raw || data.error?.message || data.message;
      lastError = new Error(`OpenRouter HTTP ${response.status}${providerMessage ? `: ${providerMessage}` : ""}`);
      console.error(`[complaint-ai] model request failed`, { model, status: response.status, message: providerMessage });

      if (response.status !== 429 && response.status < 500) throw lastError;
    }

    if (!response?.ok || !data?.choices?.length) throw lastError || new Error("OpenRouter returned no completion");

    console.log(`[complaint-ai] ${new Date().toISOString()} response received`, {
      status: response.status,
      durationMs: Date.now() - startedAt,
    });

    const raw = data.choices[0].message.content;
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    // hard enforce both fields
    const category = VALID_CATEGORIES.includes(parsed.category) ? parsed.category : "Other";
    const urgency = VALID_URGENCIES.includes(parsed.urgency) ? parsed.urgency : "Low";

    const result = {
      category,
      urgency,
      confidence: parsed.confidence || 0.5,
      description: parsed.description || "",
      model: selectedModel,
    };
    console.log(`[complaint-ai] ${new Date().toISOString()} response parsed`, {
      category: result.category,
      urgency: result.urgency,
      confidence: result.confidence,
      durationMs: Date.now() - startedAt,
    });
    return result;

  } catch (error) {
    console.error(`[complaint-ai] ${new Date().toISOString()} categorization failed`, {
      message: error.message,
      durationMs: Date.now() - startedAt,
    });

    // rule based fallback
    return classifyFromText(extractedText) || {
      category: "Other",
      urgency: "Low",
      confidence: 0,
      description: "AI categorization failed — manual review needed",
    };
  }
};
