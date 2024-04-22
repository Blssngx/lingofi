// File: pages/api/string-info.js

import fetch from 'node-fetch';

export default async function handler(req: { query: { token: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: unknown): void; new(): any; }; }; }) {
    const { token } = req.query; // Retrieve the token from the query parameters

    if (!token) {
        res.status(400).json({ error: "Token is required" });
        return;
    }

    try {
        const url = `http://localhost:8080/api/getStringInfo/${token}`;
        const response = await fetch(url);
        const data: any = await response.json();

        if (data.message == "Token doesn't exist") {
            res.status(404).json({ name: "Not Found" });
            return;
        }

        res.status(200).json(data);
    } catch (error) {
        console.error("Failed to fetch string info:", error);
        res.status(500).json({ error: "Failed to fetch string info" });
    }
}
