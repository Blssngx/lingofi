import json
import os
import requests

def strict_output(system_prompt, user_prompt, output_format, default_category="", output_value_only=False,
                  model="gemini-1.0-pro-latest", temperature=1, num_tries=3, verbose=False):
    list_input = isinstance(user_prompt, list)
    dynamic_elements = "<" in json.dumps(output_format)
    list_output = "[" in json.dumps(output_format)

    error_msg = ""
    gemini_api_key = os.getenv('GEMINI_API_KEY')  # Assuming you have set your API key in the environment
    headers = {"Authorization": f"Bearer {gemini_api_key}"}

    for i in range(num_tries):
        output_format_prompt = f"You are to output {'an array of objects in' if list_output else ''} the following format: {json.dumps(output_format)}. \nDo not put quotation marks or escape character \\ in the output fields."
        
        if list_output:
            output_format_prompt += "\nIf output field is a list, classify output into the best element of the list."

        if dynamic_elements:
            output_format_prompt += "\nAny text enclosed by < and > indicates you must generate content to replace it. Example input: Go to <location>, Example output: Go to the garden\nAny output key containing < and > indicates you must generate the key name to replace it. Example input: {'<location>': 'description of location'}, Example output: {school: a place for education}"
        
        if list_input:
            output_format_prompt += "\nGenerate an array of json, one json for each input element."

        prompt = f"{system_prompt}\n{output_format_prompt}{error_msg}\n{user_prompt if isinstance(user_prompt, str) else '\n'.join(user_prompt)}"

        response = requests.post(f"https://api.example.com/generate", headers=headers, json={
            "model": model,
            "prompt": prompt,
            "temperature": temperature,
            "max_tokens": 2048
        })

        if response.status_code != 200:
            if verbose:
                print("API call failed with status code:", response.status_code)
            continue

        try:
            output = json.loads(response.text.replace("'", '"'))
            if list_input:
                if not isinstance(output, list):
                    raise ValueError("Output format not in an array of json")

            validated_output = []
            for item in output if list_input else [output]:
                validated_item = {}
                for key, value in output_format.items():
                    if "<" in key:
                        continue  # Skip dynamic keys
                    if key not in item:
                        raise KeyError(f"{key} not in json output")
                    validated_item[key] = item[key]

                    if isinstance(value, list) and item[key] not in value:
                        if default_category:
                            validated_item[key] = default_category
                        else:
                            raise ValueError("Output value does not match any expected categories")
                if output_value_only:
                    validated_output.append(list(validated_item.values()))
                else:
                    validated_output.append(validated_item)

            return validated_output if list_input else validated_output[0]
        except (json.JSONDecodeError, KeyError, ValueError) as e:
            error_msg = f"\n\nResult: {response.text}\n\nError message: {str(e)}"
            if verbose:
                print("An exception occurred:", str(e))
                print("Current invalid json format", response.text)

    return []

# Example usage:
output_format = {
    "name": "string",
    "age": ["young", "adult", "senior"]
}
system_prompt = "Please generate user data."
user_prompt = ["John", "Doe"]
print(strict_output(system_prompt, user_prompt, output_format))
