from flask import Flask, request, jsonify
from flask_cors import CORS
from mech_client.interact import interact, ConfirmationType
import json

app = Flask(__name__)
CORS(app)

@app.route('/api/interact', methods=['POST'])
def api_interact():
    try:
        # Extract data from request
        data = request.get_json()

        # Parse the JSON into Python variables
        prompt_text = data.get('prompt', '')
        agent_id = data.get('agent_id', 0)
        tool_name = data.get('tool', '')
        chain_config = data.get('chain_config', '')
        confirmation_type = ConfirmationType.ON_CHAIN  # Assuming fixed value as per your scenario
        private_key_path = data.get('private_key_path', '')

        # Call the interact function
        response = interact(
            prompt=prompt_text,
            agent_id=agent_id,
            tool=tool_name,
            chain_config=chain_config,
            confirmation_type=confirmation_type,
            private_key_path=private_key_path
        )

        # Check if response is already a dictionary
        if isinstance(response, dict):
            # Optionally process 'result' field if it's a JSON string
            if 'result' in response and isinstance(response['result'], str):
                response['result'] = json.loads(response['result'])
            return jsonify(response)
        else:
            # Handle the case where response might be a JSON string
            response_dict = json.loads(response)
            return jsonify(response_dict)
        
    except json.JSONDecodeError as e:
        return jsonify({"error": "JSON Decode Error", "details": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
