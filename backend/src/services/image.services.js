const REMOVE_BG_ENDPOINT = "https://api.remove.bg/v1.0/removebg";

const pickOutputMimeType = (inputMimeType) => {
  if (inputMimeType === "image/webp") {
    return "image/webp";
  }

  return "image/png";
};

export async function removeBackgroundFromImage({ imageBuffer, filename, mimeType }) {
  const apiKey = (process.env.REMOVE_BG_API_KEY || "").trim();

  if (!apiKey) {
    const error = new Error("REMOVE_BG_API_KEY is not configured");
    error.code = "REMOVE_BG_API_KEY_MISSING";
    throw error;
  }

  const outputMimeType = pickOutputMimeType(mimeType);
  const form = new FormData();

  form.append(
    "image_file",
    new Blob([imageBuffer], { type: mimeType || "image/png" }),
    filename || "profile-photo.png"
  );
  form.append("size", "preview");
  form.append("format", outputMimeType === "image/webp" ? "webp" : "png");

  const response = await fetch(REMOVE_BG_ENDPOINT, {
    method: "POST",
    headers: {
      "X-Api-Key": apiKey,
    },
    body: form,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`remove.bg failed with ${response.status}: ${detail}`);
  }

  const arrayBuffer = await response.arrayBuffer();

  return {
    buffer: Buffer.from(arrayBuffer),
    mimeType: outputMimeType,
    backgroundRemoved: true,
  };
}
