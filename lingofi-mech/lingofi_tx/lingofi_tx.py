"""
This module implements a tool which prepares a transaction for the transaction settlement skill.
Please note that the gnosis safe parameters are missing from the payload, e.g., `safe_tx_hash`, `safe_tx_gas`, etc.
"""
import json
import sys
import argparse
from openai import OpenAI
from typing import Any, Dict, Optional, Tuple
import ast

ENGINE = "gpt-3.5-turbo"
MAX_TOKENS = 500
TEMPERATURE = 0.7
TOOL_PREFIX = "transfer-"

LINGOFI_TX_PROMPT = """
Interpret the input command to construct a transaction payload for the blockchain.

For the input: {user_prompt}, format the response as a JSON dictionary:

    "currency": Extract currency (Celo, cUSD, cEUR, cREAL) from command,
    "amount": Determine the transfer amount,
    "recipient": Extract recipient name,
    "reason": Identify the transaction purpose,

Respond only with the constructed transaction object, using provided and derived values.
"""


client: Optional[OpenAI] = None

class OpenAIClientManager:
    """Client context manager for OpenAI."""
    def __init__(self, api_key: str):
        self.api_key = api_key

    def __enter__(self) -> OpenAI:
        global client
        if client is None:
            client = OpenAI(api_key=self.api_key)
        return client

    def __exit__(self, exc_type, exc_value, traceback) -> None:
        global client
        if client is not None:
            client.close()
            client = None

def make_request_openai_request(prompt: str, engine: str = ENGINE, max_tokens: Optional[int] = None, temperature: Optional[float] = None) -> str:
    """Make openai request."""
    max_tokens = max_tokens or MAX_TOKENS
    temperature = temperature or TEMPERATURE
    moderation_result = client.moderations.create(input=prompt)
    if moderation_result.results[0].flagged:
        return "Moderation flagged the prompt as in violation of terms."

    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": prompt},
    ]
    response = client.chat.completions.create(
        model=engine,
        messages=messages,
        temperature=temperature,
        max_tokens=max_tokens,
        n=1,
        timeout=120,
        stop=None,
    )
    return response.choices[0].message.content

def lingofi_tx(prompt: str) -> Tuple[str, Optional[str], Optional[Dict[str, Any]], Any]:
    """Perform lingofi tx."""
    tool_prompt = LINGOFI_TX_PROMPT.format(user_prompt=prompt)
    response = make_request_openai_request(prompt=tool_prompt)

    try:
        # parse the response to get the transaction object string itself
        parsed_txs = ast.literal_eval(response)
    except SyntaxError:
        return response, None, None, None

    # build the transaction object, unknowns are referenced from parsed_txs
    transaction = {
        "currency": str(parsed_txs["currency"]),
        "amount": int(parsed_txs["amount"]),
        "recipient": str(parsed_txs["recipient"]),
        "reason": str(parsed_txs["reason"]),
    }
    return response, prompt, None, None

AVAILABLE_TOOLS = {
    "lingofi_tx": lingofi_tx, 
}

def error_response(msg: str) -> Tuple[str, None, None, None]:
    """Return an error mech response."""
    return msg, None, None, None

def run(**kwargs) -> Tuple[str, Optional[str], Optional[Dict[str, Any]], Any]:
    """Run the task"""
    tool = kwargs.get("tool", None)

    if tool is None:
        return error_response("No tool has been specified.")

    prompt = kwargs.get("prompt", None)
    if prompt is None:
        return error_response("No prompt has been given.")

    transaction_builder = AVAILABLE_TOOLS.get(tool, None)
    if transaction_builder is None:
        return error_response(
            f"Tool {tool!r} is not in supported tools: {tuple(AVAILABLE_TOOLS.keys())}."
        )

    api_key = kwargs.get("api_keys", {}).get("openai", None)
    if api_key is None:
        return error_response("No api key has been given.")

    with OpenAIClientManager(api_key):
        return transaction_builder(prompt)
