```javascript
document.addEventListener('DOMContentLoaded', () => {
    const num1Input = document.getElementById('num1');
    const operatorSelect = document.getElementById('operator');
    const num2Input = document.getElementById('num2');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDiv = document.getElementById('result');

    // Function to perform validation
    function validateInputs(num1, num2) {
        if (isNaN(num1) || isNaN(num2)) {
            return "Please enter valid numbers for both fields.";
        }
        return null; // No error
    }

    calculateBtn.addEventListener('click', async () => {
        const num1 = parseFloat(num1Input.value);
        const num2 = parseFloat(num2Input.value);
        const operator = operatorSelect.value;

        const validationError = validateInputs(num1, num2);
        if (validationError) {
            resultDiv.textContent = `Error: ${validationError}`;
            resultDiv.style.color = 'var(--accent-color)'; // Red for error
            return;
        }

        // Reset result display style if it was an error before
        resultDiv.style.color = 'var(--accent-color)'; 
        resultDiv.textContent = 'Calculating...';

        try {
            // Adjust the URL if your FastAPI backend is not on the same origin
            // For example: 'http://127.0.0.1:8000/calculate'
            const response = await fetch('/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    num1: num1,
                    num2: num2,
                    operator: operator
                }),
            });

            const data = await response.json();

            if (response.ok) {
                if (data.result !== undefined) {
                    resultDiv.textContent = `Result: ${data.result}`;
                    resultDiv.style.color = 'var(--accent-color)'; // Success color
                } else if (data.error) {
                    resultDiv.textContent = `Error: ${data.error}`;
                    resultDiv.style.color = 'var(--accent-color)'; // Error color
                }
            } else {
                // Handle HTTP errors (e.g., 400 Bad Request, 500 Internal Server Error)
                resultDiv.textContent = `Server Error: ${data.detail || data.error || response.statusText}`;
                resultDiv.style.color = 'var(--accent-color)'; // Error color
            }

        } catch (error) {
            console.error('Fetch error:', error);
            resultDiv.textContent = `Network Error: Could not reach the server.`;
            resultDiv.style.color = 'var(--accent-color)'; // Error color
        }
    });
});
```