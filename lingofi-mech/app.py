from flask import Flask, request, jsonify
from flask_cors import CORS
from mech_client.interact import interact, ConfirmationType
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all domains and routes

@app.route('/api/interact', methods=['POST'])
def api_interact():
    try:
        # Receive and parse incoming JSON data
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        # Debugging line to check what JSON data is received
        print("Received JSON:", data)

        # Extract 'prompt' from the JSON data
        prompt = data.get('prompt')
        prompt_text = "Interpret the input command to generate a transaction payload that can be processed by the blockchain network. Here is the prompt: " + prompt + ". Create a JSON reponse with the currency, amount, and recipient."
        if not prompt_text:
            return jsonify({"error": "Prompt is required"}), 400

        # Set fixed parameters as per your requirements
        tool_name = "openai-gpt-4"
        chain_config = "celo"
        agent_id = 2
        private_key_path = "ethereum_private_key.txt"

        # Call the interact function with fixed and provided parameters
        response = interact(
            prompt=prompt_text,
            agent_id=agent_id,
            tool=tool_name,
            chain_config=chain_config,
            confirmation_type=ConfirmationType.ON_CHAIN,
            private_key_path=private_key_path
        )

        # Check the type of 'response' and format it for JSON response
        if isinstance(response, dict):
            # If 'result' is a string that needs to be interpreted as JSON
            if 'result' in response and isinstance(response['result'], str):
                response['result'] = json.loads(response['result'])
            return jsonify(response)
        else:
            # Assuming response is a JSON string that needs to be converted to a dict
            response_dict = json.loads(response)
            return jsonify(response_dict)

    except json.JSONDecodeError as e:
        return jsonify({"error": "JSON Decode Error", "details": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
