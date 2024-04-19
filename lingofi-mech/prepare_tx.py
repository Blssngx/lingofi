# -*- coding: utf-8 -*-
# ------------------------------------------------------------------------------
#
#   Copyright 2024 Valory AG
#
#   Licensed under the Apache License, Version 2.0 (the "License");
#   you may not use this file except in compliance with the License.
#   You may obtain a copy of the License at
#
#       http://www.apache.org/licenses/LICENSE-2.0
#
#   Unless required by applicable law or agreed to in writing, software
#   distributed under the License is distributed on an "AS IS" BASIS,
#   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#   See the License for the specific language governing permissions and
#   limitations under the License.
#
# ------------------------------------------------------------------------------

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

NATIVE_TRANSFER_PROMPT = """Interpret the input command to generate a transaction payload that can be processed by the blockchain network.

Construct a transaction payload for the input command: {user_prompt}

only respond with the format below using curly brackets to encapsulate the variables within a json dictionary object and no other text:

        "currency": Extract the currency from the input command, there can only be Celo, cUSD, cEUR or cREAL,
        "amount": Determine the amount to be sent.,
        "recipient": Extract the recipient from the input command. Only the name,
        "reason": Extract the reason for the transaction from the input command.,

Do not respond with anything else other than the transaction object you constructed with the correct known variables the agent had before the request and the correct unknown values found in the user request prompt as input to the web3.py signing method.
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

def native_transfer(prompt: str) -> Tuple[str, Optional[str], Optional[Dict[str, Any]], Any]:
    """Perform native transfer."""
    tool_prompt = NATIVE_TRANSFER_PROMPT.format(user_prompt=prompt)
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
    "native_transfer": native_transfer,
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

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run the transaction tool.")
    parser.add_argument('--tool', type=str, help='Tool to use.')
    parser.add_argument('--prompt', type=str, help='Prompt for the transaction.')
    parser.add_argument('--api_key', type=str, help='OpenAI API key.')
    parser.add_argument('--engine', type=str, default=ENGINE, help='OpenAI model to use.')
    parser.add_argument('--max_tokens', type=int, default=MAX_TOKENS, help='Maximum number of tokens to use.')
    parser.add_argument('--temperature', type=float, default=TEMPERATURE, help='Temperature setting for model creativity.')

    args = parser.parse_args()

    # Execute the tool with all provided arguments
    result = run(
        tool=args.tool,
        prompt=args.prompt,
        api_keys={"openai": args.api_key},
        engine=args.engine,
        max_tokens=args.max_tokens,
        temperature=args.temperature
    )
    print(result)
