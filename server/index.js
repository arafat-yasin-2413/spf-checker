import express from "express";
import cors from "cors";
import { resolveTxt } from "dns/promises";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// SPF text resolve function
async function getSpf(domain, depth = 0) {
	if (depth > 3) return [];

	const records = await resolveTxt(domain);
	const textRecords = records.map((record) => record.join(""));

	const spfRecords = textRecords.filter((rc) => rc.toLowerCase().startsWith("v=spf1"));

	return spfRecords.map((record) => {
		const includes = [];
		const redirect = [];

		record.split(" ").forEach((part) => {
			if (part.startsWith("include:")) {
				includes.push(part.replace("include:", ""));
			}
			if (part.startsWith("redirect=")) {
				redirect.push(part.replace("redirect", ""));
			}
		});

		return { record, includes, redirect };
	});
}

app.get("/spf", async (req, res) => {
	const { domain } = req.query;

	// initial validation
	if (!domain) {
		return res.status(400).json({
			success: false,
			message: "Domain is required",
		});
	}

	try {
		const spfData = await getSpf(domain);

		if (spfData.length === 0) {
			return res.status(404).json({
				success: false,
				message: "No SPF record has been found",
			});
		}

		res.json({
			success: true,
			domain,
			spfData,
			message: "Record has been found",
		});
	} catch (err) {
		res.status(500).json({
			success: false,
			message: "DNS lookup failed",
			error: err.message,
		});
	}
});

app.get("/spf/resolve", async (req, res) => {
	const { domain } = req.query;

	try {
		const spfData = await getSpf(domain, 1);
		res.json({ success: true, spfData });
	} catch (err) {
		res.status(500).json({
			success: false,
			message: err.message,
			error: err.message,
		});
	}
});

app.listen(PORT, () => {
	console.log(`SPF Checker Server is running on port : ${PORT}`);
});
