from flask import Flask, request, jsonify
from mech_client.interact import interact, ConfirmationType
import json
import requests
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)

@app.route('/generate_transaction', methods=['GET'])
def generate_transaction():
    user_prompt = request.args.get('prompt', '')
    if not user_prompt:
        app.logger.error("No prompt provided in the request")
        return jsonify({'error': 'No prompt provided'}), 400

    prompt_text = f"""Generate a transaction payload based on: {user_prompt}
                    Respond in JSON format:
                        "currency": Extracted from the command e.g., Celo, cUSD, cEUR, or cREAL,
                        "amount": Determined from the command,
                        "recipient": Extracted from the command,
                        "reason": Extracted from the command.
                    """
    tool_name = "openai-gpt-3.5-turbo"
    chain_config = "celo"
    agent_id = 2
    private_key_path = "ethereum_private_key.txt"

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
        
        # Log response to help debugging
        app.logger.debug(f"Response from interact function: {response}")

        # Check if response is a dictionary
        if isinstance(response, dict):
            # If response contains a 'result' key which is a JSON string, decode it
            if 'result' in response and isinstance(response['result'], str):
                response = json.loads(response['result'])
            return jsonify(response), 200
        else:
            # Handle the case where response might be a JSON string
            response_dict = json.loads(response)
            return jsonify(response_dict), 200
    except json.JSONDecodeError as e:
        app.logger.error('JSON Decode Error', exc_info=True)
        return jsonify({'error': 'JSON Decode Error', 'details': str(e)}), 500
    except requests.exceptions.RequestException as e:
        app.logger.error('Request Exception', exc_info=True)
        return jsonify({'error': 'Request Exception', 'details': str(e)}), 500
    except Exception as e:
        app.logger.error('An unexpected error occurred', exc_info=True)
        return jsonify({'error': 'An unexpected error occurred', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
