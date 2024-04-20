```markdown
# Lingofi TX Payload API

This Flask-based API generates transaction payloads by processing natural language commands. It utilizes a backend function `interact` from the `mech_client` library to interpret these commands and produce a JSON-formatted response detailing the transaction specifics.

## Features

- Extract transaction details from natural language commands.
- Supports GET requests with user commands as parameters.
- Returns JSON responses containing the currency, amount, recipient, and transaction reason.

## Requirements

- Python 3.10
- Flask
- Requests
- Any additional libraries used by `mech_client`

## Installation

Follow these steps to set up the API on your local machine:

1. **Clone the Repository:**

   ```bash
    git clone [(https://github.com/Blssngx/lingofi.git)]
    cd lingofi-mech
   ```

2. **Set Up a Virtual Environment (optional but recommended):**

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install Dependencies:**

   ```bash
   pip install flask requests
   # Ensure you have mech_client and its dependencies installed as well.
   ```

4. **Configuration:**

   Ensure that the `private_key_path` in the application points to a valid EOA private key file necessary for the `interact` function.

5. **Run the Application:**

   ```bash
   python app.py
   ```

   This command starts the Flask server on `localhost` with port `5000`.

## Usage

To use the API, make a GET request to the endpoint with the required prompt as a query parameter:

```bash
curl "http://localhost:5000/lingofi_tx?prompt=Send 10 Celo to Alice for books"
```

### API Endpoint:

- **GET /lingofi_tx**
  - **Parameters:**
    - `prompt` (string): A natural language command describing the transaction.
  - **Response:**
    - A JSON object containing the transaction details such as currency, amount, recipient, and reason.

## Example

Request:

```bash
curl "http://localhost:5000/lingofi_tx?prompt=Send 10 Celo to Alice for books"
```

Response:

```json
{
  "currency": "Celo",
  "amount": 10,
  "recipient": "Alice",
  "reason": "books"
}
```

## Error Handling

The API provides detailed error messages and HTTP status codes to help diagnose issues. For instance, a `400 Bad Request` response occurs when the required `prompt` parameter is missing, and a `500 Internal Server Error` may indicate an issue with the server or backend processing.

```