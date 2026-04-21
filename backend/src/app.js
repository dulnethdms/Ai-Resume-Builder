import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import aiRoutes from "./routes/ai.routes.js";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "")
	.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

const isLocalOrigin = (origin) => {
	try {
		const url = new URL(origin);
		return url.hostname === "localhost" || url.hostname === "127.0.0.1";
	} catch {
		return false;
	}
};

const isVercelOrigin = (origin) => {
	try {
		const url = new URL(origin);
		return url.hostname === "vercel.app" || url.hostname.endsWith(".vercel.app");
	} catch {
		return false;
	}
};

app.use(
	cors({
		origin(origin, callback) {
			// Allow non-browser clients and same-origin requests without Origin header.
			if (!origin) {
				return callback(null, true);
			}

			if (
				allowedOrigins.length === 0 ||
				allowedOrigins.includes(origin) ||
				isLocalOrigin(origin) ||
				isVercelOrigin(origin)
			) {
				return callback(null, true);
			}

			return callback(new Error("Not allowed by CORS"));
		},
		credentials: true,
	})
);

app.use(express.json());
app.use("/api", authRoutes);
app.use("/api/ai", aiRoutes);

app.get("/api/health", (_req, res) => {
	res.status(200).json({
		ok: true,
		service: "ai-resume-builder-backend",
		timestamp: new Date().toISOString(),
	});
});

export default app;
