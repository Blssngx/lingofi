import { NextResponse } from 'next/server'
import { strict_output } from '@/lib/ai/gemini';
import { getAddress } from '@/lib/bc/getAddress';
import { getTokenAddress } from '@/lib/bc/getTokenAddress';
import { celo_alfajores } from '@/utils/chain';
import { sendToken } from '@/lib/bc/sendToken';

export async function GET(request: Request, response: Response) {

  const inputValue = "Kan jy asseblief 1 Celo na Jason stuur vir alkohol";
  try {
    // Generate a transaction payload
    const txPayload = await strict_output(
      "Interpret the input command to generate a transaction payload that can be processed by the blockchain network.",
      `Construct a transaction payload for the input command: ${inputValue}`,
      {
        currency: "Extract the currency from the input command, there can only be Celo, cUSD, cEUR or cREAL",
        amount: "Determine the amount to be sent.",
        recipient: "Extract the recipient from the input command.",
        reason: "Extract the reason for the transaction from the input command.",
      }
    );

    // Get the wallet address of the recipient and send gas
    const to = await getAddress(txPayload.recipient);
    const tokenAddress = await getTokenAddress(txPayload.currency);

    console.log(txPayload);
    console.log('Recipient Address: ', to);
    console.log(`Token Address: ${txPayload.currency} -`, tokenAddress);
    console.log('Amount: ', txPayload.amount);
    // console.log("Transaction payload and wallet address retrieved successfully");

    // Process the transaction

    return NextResponse.json(txPayload)

  } catch (error) {
    console.error("Error processing transaction:", error);
  }

}