import express from "express";
import cors from "cors";
import { resolveTxt } from "dns/promises";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


app.listen(PORT, ()=>{
    console.log(`SPF Checker Server is running on port : ${PORT}`)
});