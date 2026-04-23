import { Router } from "express";
import multer from "multer";
import { generateSummary } from "../services/ai.services.js";
import { removeBackgroundFromImage } from "../services/image.services.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

router.post("/summary", async (req, res) => {
  try {
    const role = (req.body?.role || "").trim();

    if (!role) {
      return res.status(400).json({ message: "Role is required" });
    }

    const summary = await generateSummary({ role });
    return res.status(200).json({ summary });
  } catch (error) {
    console.error("AI summary generation failed:", error);
    return res.status(500).json({ message: "Failed to generate summary" });
  }
});

router.post("/remove-background", upload.single("photo"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Profile photo is required" });
    }

    if (!String(req.file.mimetype || "").startsWith("image/")) {
      return res.status(400).json({ message: "Only image uploads are supported" });
    }

    const result = await removeBackgroundFromImage({
      imageBuffer: req.file.buffer,
      filename: req.file.originalname || "profile-photo.png",
      mimeType: req.file.mimetype || "image/png",
    });

    return res.status(200).json({
      mimeType: result.mimeType,
      imageBase64: result.buffer.toString("base64"),
      backgroundRemoved: result.backgroundRemoved,
    });
  } catch (error) {
    console.error("Profile background removal failed:", error);

    if (error?.code === "REMOVE_BG_API_KEY_MISSING") {
      return res.status(503).json({
        message: "Background removal is not configured on server (missing REMOVE_BG_API_KEY)",
      });
    }

    return res.status(500).json({ message: "Failed to remove image background" });
  }
});

export default router;
