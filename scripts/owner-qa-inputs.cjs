// Optional process-local secrets. Never add real registrations or a mapping here.
function ownerQaInputs(env = process.env) {
  const values = (env.NOORDTUNE_OWNER_QA_PLATES || "").split(/[;,\s]+/).filter(Boolean);
  if (values.length && values.length !== 4) throw new Error("NOORDTUNE_OWNER_QA_PLATES requires four ordered local inputs.");
  return values.map((value, index) => {
    const plate = value.replace(/[^a-z0-9]/gi, "").toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(plate)) throw new Error("Invalid local owner QA input format.");
    return {id: `OWNER-${String.fromCharCode(65 + index)}`, plate};
  });
}

function sanitizeOwnerQa(value, inputs = ownerQaInputs()) {
  if (typeof value === "string") {
    for (const {plate, id} of inputs) value = value.replace(new RegExp(plate.split("").join("(?:[-\\s]|%2D|%20)*"), "gi"), id);
    return value;
  }
  if (Array.isArray(value)) return value.map(item => sanitizeOwnerQa(item, inputs));
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value)
    .filter(([key]) => !["plate", "kenteken", "normalizedKenteken"].includes(key))
    .map(([key, item]) => [sanitizeOwnerQa(key, inputs), sanitizeOwnerQa(item, inputs)]));
  return value;
}
module.exports = {ownerQaInputs, sanitizeOwnerQa};
