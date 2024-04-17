// File: pages/api/string-info.js

import fetch from 'node-fetch';

export default async function handler(req:
    {
        query: { token: any; address: any; },
    }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: unknown): void; new(): any; }; }; }) {
    const { token } = req.query; // Retrieve the token from the query parameters
    const { address } = req.query; // Retrieve the address from the query parameters
    console.log(token, address)
    if (!token) {
        res.status(400).json({ error: "Token is required" });
        return;
    }

    if (!address) {
        res.status(400).json({ error: "Address is required" });
        return;
    }

    try {
        const url = `${process.env.STRING_URL}/${token}/${address}`;
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
