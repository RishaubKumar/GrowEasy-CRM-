const { extractFromGemini, CRM_STATUS, DATA_SOURCE } = require("../services/geminiService");

const BATCH_SIZE = 20;

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

function cleanRecord(record) {
  return {
    created_at: record.created_at || "",
    name: record.name || "",
    email: record.email || "",
    country_code: record.country_code || "",
    mobile_without_country_code: record.mobile_without_country_code || "",
    company: record.company || "",
    city: record.city || "",
    state: record.state || "",
    country: record.country || "",
    lead_owner: record.lead_owner || "",
    crm_status: CRM_STATUS.includes(record.crm_status) ? record.crm_status : "",
    crm_note: record.crm_note || "",
    data_source: DATA_SOURCE.includes(record.data_source) ? record.data_source : "",
    possession_time: record.possession_time || "",
    description: record.description || "",
  };
}

exports.importCsv = async (req, res) => {
  try {
    const { rows } = req.body;

    if (!rows || rows.length === 0) {
      return res.status(400).json({ message: "No rows to import" });
    }

    const batches = chunkArray(rows, BATCH_SIZE);
    const records = [];
    const skipped = [];
    let batchErrorMessage = "";

    for (const batch of batches) {
      let extracted;
      try {
        extracted = await extractFromGemini(batch);
      } catch (err) {
        batchErrorMessage = err.message;
        batch.forEach((row) =>
          skipped.push({ originalRow: row, reason: err.message })
        );
        continue;
      }

      if (!Array.isArray(extracted)) {
        batchErrorMessage = "AI returned an invalid response structure (expected JSON array).";
        batch.forEach((row) =>
          skipped.push({ originalRow: row, reason: batchErrorMessage })
        );
        continue;
      }

      batch.forEach((row, i) => {
        const item = extracted[i];
        if (!item) {
          skipped.push({
            originalRow: row,
            reason: "AI failed to map this record.",
          });
        } else if (item.skip) {
          skipped.push({
            originalRow: row,
            reason: item.skipReason || "No email or mobile number",
          });
        } else {
          records.push(cleanRecord(item));
        }
      });
    }

    if (records.length === 0 && skipped.length === 0 && batchErrorMessage) {
      return res.status(502).json({ message: batchErrorMessage });
    }

    res.json({
      records,
      skipped,
      totalImported: records.length,
      totalSkipped: skipped.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
