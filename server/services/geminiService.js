const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// allowed values from the assignment
const CRM_STATUS = ["GOOD_LEAD_FOLLOW_UP", "DID_NOT_CONNECT", "BAD_LEAD", "SALE_DONE"];
const DATA_SOURCE = ["leads_on_demand", "meridian_tower", "eden_park", "varah_swamy", "sarjapur_plots"];

function buildPrompt(rows) {
  return `You are mapping CSV lead data into a CRM format for GrowEasy.

The CSV column names can be anything (Facebook export, Google Ads export, spreadsheet, etc).
Look at the values, not just the column names, and figure out which CRM field each value belongs to.

Return a JSON array with one object per input row, in the same order, using this format:
{
  "created_at": "",       // must work with JS new Date()
  "name": "",
  "email": "",             // use first email if more than one
  "country_code": "",
  "mobile_without_country_code": "", // use first number if more than one
  "company": "",
  "city": "",
  "state": "",
  "country": "",
  "lead_owner": "",
  "crm_status": "",        // one of: ${CRM_STATUS.join(", ")} or leave blank
  "crm_note": "",          // extra notes, extra emails/phones go here
  "data_source": "",       // one of: ${DATA_SOURCE.join(", ")} or leave blank
  "possession_time": "",
  "description": "",
  "skip": false,           // true if row has no email AND no mobile number
  "skipReason": ""
}

Rules:
- Only use the allowed crm_status and data_source values, else leave blank.
- If a row has neither email nor phone number, set skip to true.
- Do not make up data you can't find in the row.
- Return ONLY the JSON array, no extra text.

CSV rows:
${JSON.stringify(rows)}`;
}

function fallbackMapRows(rows) {
  return rows.map((row) => {
    const email = String(row.email || "")
      .split(/[,;|]/)
      .map((value) => value.trim())
      .find(Boolean) || "";
    const phone = String(row.phone || row.mobile || row.mobile_without_country_code || "")
      .split(/[,;|]/)
      .map((value) => value.trim())
      .find(Boolean) || "";
    const name = row.name || row.full_name || row.contact_name || "";
    const company = row.company || row.organization || "";
    const city = row.city || row.location || "";

    const hasEmailOrPhone = Boolean(email || phone);

    return {
      created_at: row.created_at || "",
      name,
      email,
      country_code: row.country_code || "",
      mobile_without_country_code: phone,
      company,
      city,
      state: row.state || "",
      country: row.country || "",
      lead_owner: row.lead_owner || "",
      crm_status: "",
      crm_note: row.crm_note || "",
      data_source: "",
      possession_time: row.possession_time || "",
      description: row.description || "",
      skip: !hasEmailOrPhone,
      skipReason: !hasEmailOrPhone ? "No email or mobile number" : "",
    };
  });
}

async function extractFromGemini(rows) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const prompt = buildPrompt(rows);
  const maxRetries = 3;
  let attempt = 0;
  let delay = 1000;

  while (attempt <= maxRetries) {
    try {
      const response = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0 },
        }),
      });

      if (!response.ok) {
        let errorText = "";
        try {
          errorText = await response.text();
        } catch {
          errorText = "";
        }

        throw new Error(
          `Gemini API request failed (${response.status}): ${errorText || "Unknown error"}`
        );
      }

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Gemini API returned an invalid JSON response.");
      }

      let text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

      text = text.trim().replace(/^```json/, "").replace(/```$/, "").trim();

      try {
        return JSON.parse(text);
      } catch {
        throw new Error("Gemini API returned an invalid JSON payload.");
      }
    } catch (err) {
      if (attempt === maxRetries) {
        throw err;
      }
      attempt++;
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
}

module.exports = { extractFromGemini, CRM_STATUS, DATA_SOURCE };
