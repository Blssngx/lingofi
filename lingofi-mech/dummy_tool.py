from typing import List, Dict, Any, Optional, Tuple

def run(**kwargs) -> Tuple[Any, Optional[str], Optional[Any], Optional[Any]]:
    """Run the task"""

    # Prepare the response
    prompt = kwargs.get("prompt", None)

    # Implement the logic here
    response = "Dummy response"

    # Return the response
    transaction = None # this tool does not perform any transaction
    cost_object = None # this tool does not return any result

    return response, prompt, transaction, cost_object

if __name__ == "__main__":
    # Define your parameters
    prompt = 'Will Gnosis pay reach 100k cards in 2024?'
    response = run(prompt=prompt)
    print(response)
