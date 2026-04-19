import dotenv from "dotenv";
import { connectDb } from "./config/db.js";

dotenv.config();

const { default: app } = await import("./app.js");

const port = Number(process.env.PORT) || 5000;

await connectDb();

app.listen(port, () => {
	console.log(`Backend running on http://localhost:${port}`);
	console.log("Env check:");
	console.log(`- MONGODB_URI set: ${Boolean(process.env.MONGODB_URI)}`);
	console.log(`- JWT_SECRET set: ${Boolean(process.env.JWT_SECRET)}`);
	console.log(`- CORS_ORIGIN: ${process.env.CORS_ORIGIN || "(not set)"}`);
});
