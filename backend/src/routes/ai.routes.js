import { Router } from "express";
import { generateSummary } from "../services/ai.services.js";

const router = Router();

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

export default router;
