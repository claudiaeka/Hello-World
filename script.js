// Calculator State
let display = document.getElementById('display');
let currentValue = '';
let previousValue = '';
let operation = null;
let shouldResetDisplay = false;

// Append number to display
function appendNumber(num) {
    if (shouldResetDisplay) {
        currentValue = '';
        shouldResetDisplay = false;
    }

    // Prevent multiple decimal points
    if (num === '.' && currentValue.includes('.')) {
        return;
    }

    // Prevent leading zeros (except for decimals)
    if (currentValue === '0' && num !== '.') {
        currentValue = num;
    } else {
        currentValue += num;
    }

    updateDisplay();
}

// Append operator
function appendOperator(op) {
    if (currentValue === '') {
        return;
    }

    if (previousValue !== '') {
        // Calculate intermediate result if there's a pending operation
        calculate();
    } else {
        previousValue = currentValue;
    }

    operation = op;
    currentValue = '';
    shouldResetDisplay = true;
}

// Calculate result
function calculate() {
    if (currentValue === '' || previousValue === '' || operation === null) {
        return;
    }

    let result;
    const prev = parseFloat(previousValue);
    const current = parseFloat(currentValue);

    switch (operation) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                display.value = 'Error';
                currentValue = '';
                previousValue = '';
                operation = null;
                return;
            }
            result = prev / current;
            break;
        case '%':
            result = prev % current;
            break;
        default:
            return;
    }

    // Round to avoid floating point errors
    result = Math.round(result * 100000000) / 100000000;

    currentValue = String(result);
    previousValue = '';
    operation = null;
    shouldResetDisplay = true;
    updateDisplay();
}

// Clear display and reset
function clearDisplay() {
    currentValue = '';
    previousValue = '';
    operation = null;
    shouldResetDisplay = false;
    updateDisplay();
}

// Delete last character
function deleteLast() {
    if (shouldResetDisplay) {
        return;
    }

    currentValue = currentValue.slice(0, -1);
    updateDisplay();
}

// Update display
function updateDisplay() {
    display.value = currentValue || '0';
}

// Handle keyboard input
document.addEventListener('keydown', function(event) {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendNumber('.');
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendOperator(key);
    } else if (key === '%') {
        appendOperator('%');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    } else if (key === 'Escape') {
        clearDisplay();
    }
});

// Initialize display
updateDisplay();