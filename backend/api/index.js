import app from "../src/app.js";
import { connectDb } from "../src/config/db.js";

let dbConnectionPromise;

async function ensureDbConnection() {
	if (!dbConnectionPromise) {
		dbConnectionPromise = connectDb().catch((error) => {
			// Allow a retry on the next request if first connection attempt fails.
			dbConnectionPromise = undefined;
			throw error;
		});
	}

	await dbConnectionPromise;
}

export default async function handler(req, res) {
	try {
		await ensureDbConnection();
		return app(req, res);
	} catch (error) {
		console.error("Vercel API initialization failed:", error);
		return res.status(500).json({
			message: "Server initialization failed",
			detail: error?.message || "Unknown error",
		});
	}
}
