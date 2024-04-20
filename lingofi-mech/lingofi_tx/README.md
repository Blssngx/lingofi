# Transaction Tool for Blockchain

This Python module provides a command-line interface to prepare and simulate blockchain transactions using the OpenAI API. It's designed to facilitate the construction of transaction payloads based on user inputs.

## Prerequisites

Before you can run this tool, you need to ensure your system meets the following prerequisites:

- Python 3.10 or higher installed
- `openai` Python library installed. You can install this using pip:
  ```
  pip install openai
  ```

Additionally, you will need an API key from OpenAI to authenticate your requests.

## Installation

Clone this repository or download the source code to your local machine. You can use the following command to clone the repository:
```
git clone [(https://github.com/Blssngx/lingofi.git)]
cd cd lingofi-mech/lingofi_tx
```

## Configuration

No specific configuration is needed aside from having your OpenAI API key ready.

## Usage

To run the transaction tool, navigate to the directory containing the script and use the following command syntax:

```
python [script_name].py --tool TOOL_NAME --prompt "YOUR_PROMPT" --api_key "YOUR_OPENAI_API_KEY" --engine ENGINE_NAME --max_tokens MAX_TOKENS --temperature TEMPERATURE
```

### Parameters

- `--tool`: Specifies the transaction tool to use. For now, use `lingofi_tx`.
- `--prompt`: Provides the user prompt that the OpenAI model will interpret to construct the transaction.
- `--api_key`: Your OpenAI API key.
- `--engine`: (Optional) The specific OpenAI engine to use, default is `gpt-3.5-turbo`.
- `--max_tokens`: (Optional) Maximum number of tokens the model should generate, default is 500.
- `--temperature`: (Optional) Controls the randomness of the output, default is 0.7.

### Example

Here's an example command to run the transaction tool:

```
python test_lingofi_tx.py --tool lingofi_tx --prompt "Send 100 cUSD to Alice for coffee" --api_key "sk-xxxxxxxxxxxxxxxxxxxxxxxxx" --engine "gpt-3.5-turbo" --max_tokens 100 --temperature 0.9
```

## Output

The script will output the transaction details based on the input prompt, including any errors encountered during the execution.

```
('{\n    "currency": "cUSD",\n    "amount": 100,\n    "recipient": "Alice",\n    "reason": "coffee"\n}', 'Send 100 cUSD to Alice for coffee', None, None)
```

## Troubleshooting

If you encounter errors related to missing libraries, ensure all dependencies are installed using pip. For other issues, check your API key and input parameters for accuracy.
