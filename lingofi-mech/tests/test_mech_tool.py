from mech_client.interact import interact, ConfirmationType
import json
import requests

user_prompt = 'I want to send 5 Celo to Alice.'

prompt_text = f"""Generate a transaction payload based on: {user_prompt}
Respond in JSON format:
  "currency": Extracted from the command e.g., Celo, cUSD, cEUR, or cREAL,
  "amount": Determined from the command,
  "recipient": Extracted from the command,
  "reason": Extracted from the command.
"""

print(prompt_text)

tool_name = "openai-gpt-3.5-turbo"
chain_config = "celo"
agent_id = 2
private_key_path = "ethereum_private_key.txt"

# Function call with error handling
try:
    # Call the interact function
    response = interact(
        prompt=prompt_text,
        agent_id=agent_id,
        tool=tool_name,
        chain_config=chain_config,
        confirmation_type=ConfirmationType.ON_CHAIN,
        private_key_path=private_key_path
    )
    
    # Check if response is already a dictionary
    if isinstance(response, dict):
        # Print formatted JSON from the dictionary
        print(json.dumps(response, indent=4))
        # If response contains a 'result' key which is a JSON string, decode it
        if 'result' in response and isinstance(response['result'], str):
            result_data = json.loads(response['result'])
            print(json.dumps(result_data, indent=4))
    else:
        # Handle the case where response might be a JSON string
        response_dict = json.loads(response)
        print(json.dumps(response_dict, indent=4))
        
except json.JSONDecodeError as e:
    print("JSON Decode Error:", e)
except requests.exceptions.RequestException as e:
    # Handles HTTPError, ConnectionError, Timeout, etc.
    print("Request Exception:", e)
except Exception as e:
    # General exception catch-all
    print("An unexpected error occurred:", e)
