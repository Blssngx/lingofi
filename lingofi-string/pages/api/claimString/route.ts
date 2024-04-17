// // File: pages/api/claimString.js

import { NextResponse } from "next/server";

// import fetch from 'node-fetch';
// import { NextApiRequest, NextApiResponse } from 'next';

// export default async function handler(
//     req: NextApiRequest,
//     res: NextApiResponse
// ) {
//     const { token, address } = req.query; // Destructure both token and address from query parameters

//     // Validate that both token and address are provided
//     if (!token) {
//         res.status(400).json({ error: "Token is required" });
//         return;
//     }
//     if (!address) {
//         res.status(400).json({ error: "Address is required" }); // Corrected error message
//         return;
//     }

//     try {
//         // Construct the URL with both token and address
//         const url = `${process.env.STRING_URL}/${token}/${address}`;
        
//         const response = await fetch(url);
//         const data = await response.json() as { message: string };

//         if (data.message === "Token doesn't exist") {
//             res.status(404).json({ name: "Not Found" });
//             return;
//         }

//         res.status(200).json(data);
//     } catch (error) {
//         console.error("Failed to claim string:", error);
//         res.status(500).json({ error: "Failed to claim string" });
//     }
// }

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json(); // Destructure both token and address from query parameters
        const { token, address } = body;
        // Validate that both token and address are provided
        if (!token) {
            return NextResponse.json({ error: "Token is required" });;
        }
        if (!address) {
            res.status(400).json({ error: "Address is required" }); // Corrected error message
            return;
        }

        // Construct the URL with both token and address
        const url = `${process.env.STRING_URL}/${token}/${address}`;
        
        const response = await fetch(url);
        const data = await response.json() as { message: string };

        if (data.message === "Token doesn't exist") {
            res.status(404).json({ name: "Not Found" });
            return;
        }

        res.status(200).json(data);
    } catch (error) {
        console.error("Failed to claim string:", error);
        res.status(500).json({ error: "Failed to claim string" });
    }
}