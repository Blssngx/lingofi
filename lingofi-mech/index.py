from flask import Flask, request, jsonify
from typing import List, Dict, Any, Optional, Tuple

app = Flask(__name__)

def run(prompt: Optional[str]) -> Tuple[Any, Optional[str], Optional[Any], Optional[Any]]:
    response = "Dummy response"
    transaction = None  # this tool does not perform any transaction
    cost_object = None  # this tool does not return any result
    return response, prompt, transaction, cost_object

@app.route('/api/run', methods=['POST'])
def handle_run():
    data = request.json
    prompt = data.get('prompt')
    response, prompt, transaction, cost_object = run(prompt)
    return jsonify({
        'response': response,
        'prompt': prompt,
        'transaction': transaction,
        'cost_object': cost_object
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
