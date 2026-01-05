import express from "express";
import cors from "cors";
import { resolveTxt } from "dns/promises";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/spf", async (req, res) => {
	const { domain } = req.query;

    // initial validation
    if(!domain) {
        return res.status(400).json({
            success: false,
            message: "Domain is required",
        });
    }

    try{
        const records = await resolveTxt(domain);

        // flatttening the text records
        const textRecords = records.map(record => record.join(""));

        // SPF filter
        const spfRecords = textRecords.filter(rc => rc.toLowerCase().startsWith("v=spf1"));

        if(spfRecords.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No SPF record has been found",
            });
        }

        res.json({
            success: true,
            domain,
            spfRecords,
            message: "Record has been found",
        });
    }
    catch(err){
        res.status(500).json({
            success: false,
            message: "DNS lookup failed",
            error: err.message,
        });
    }
});

app.listen(PORT, () => {
	console.log(`SPF Checker Server is running on port : ${PORT}`);
});
