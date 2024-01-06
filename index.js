let expression = [];
let operations = ['MOD', 'DIV', 'MUL', 'ADD', 'SUB'];

function updateDisplay() {
    let expressionText = document.getElementById('expression-text');
    let resultText = document.getElementById('result-text');

    resultText.textContent = '';

    let operationSymbols = {
        'MOD': '%',
        'DIV': '/',
        'MUL': 'X',
        'ADD': '+',
        'SUB': '-'
    }

    if (expression.length === 0) {
        expressionText.textContent = '';
        return;
    }

    expressionText.textContent = expression.map(function(operation) {
        if (!isValidOperation(operation)) return operation;
        return operationSymbols[operation];
    }).join(' ');
}

function resetExpression() {
    expression = [];
    updateDisplay();
}

function removeLastAppended() {
    let last = getLastAppended();
    if (last === undefined) return;
    if (isValidOperation(last)) {
        expression.pop();
    } else {
        if (last.length === 1) {
            expression.pop();
        } else {
            last = last.slice(0, last.length-1);
            expression[expression.length-1] = last;
        }
    }

    updateDisplay();
}

function getLastAppended() {
    if (expression.length === 0) return undefined;
    return expression[expression.length-1];
}

function isValidOperation(operationType) {
    return operations.includes(operationType);
}

function appendNumber(char) {
    let current = getLastAppended();
    if (current === undefined || isValidOperation(current)) {
        expression.push(char);
    } else {
        current += char;
        expression[expression.length-1] = current;
    }

    updateDisplay();
}

function appendDecimal() {
    let current = getLastAppended();
    if (current === undefined || isValidOperation(current)) {
        expression.push("0.");
    } else {
        if (current.indexOf('.') !== -1) return;
        current += '.';
        expression[expression.length-1] = current;
    }

    updateDisplay();
}

function appendOperation(operationType) {
    if (!isValidOperation(operationType)) return;
    let current = getLastAppended();
    
    // Needs a number before it to be valid
    if (current === undefined) return;

    // Replace last operation if exists
    if (isValidOperation(current)) removeLastAppended();
    
    expression.push(operationType);

    updateDisplay();
}

function calculateExpression() {
    let resultText = document.getElementById('result-text');

    let currentExpression = expression.map((x) => x);

    if (currentExpression.length % 2 === 0) {
        resultText.textContent = 'ERROR!';
        return;
    }


    for (let i = 0; i < operations.length; i++) {
        let currentOperation = operations[i];
        while (currentExpression.includes(currentOperation)) {
            for (let j = 0; j < currentExpression.length; j++) {
                if (currentExpression[j] !== currentOperation) continue;
            
                let firstNum = parseFloat(currentExpression[j-1]);
                let secondNum = parseFloat(currentExpression[j+1]);
                let result = 0;

                switch (currentOperation) {
                    case 'MOD':
                        result = firstNum % secondNum;
                        break;
                    case 'DIV':
                        result = firstNum / secondNum;
                        break;
                    case 'MUL':
                        result = firstNum * secondNum;
                        break;
                    case 'ADD':
                        result = firstNum + secondNum;
                        break;
                    case 'SUB':
                        result = firstNum - secondNum;
                        break;
                } 

                currentExpression[j] = result.toString();
                currentExpression.splice(j-1, 1);
                currentExpression.splice(j, 1);
                
                break;
            }
        }
    }

    if (currentExpression.length === 1) {
        resultText.textContent = currentExpression[0];
    }
}

window.addEventListener('keydown', (e) => {
    if (e.key >= 0 && e.key <= 10) {
        appendNumber(e.key);
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
        removeLastAppended();
    } else if (e.key === '/') {
        appendOperation('SUB');
    } else if (e.key === '*') {
        appendOperation('MUL');
    } else if (e.key === '-') {
        appendOperation('SUB');
    } else if (e.key === '+') {
        appendOperation('ADD');
    } else if (e.key === '%') {
        appendOperation('MOD');
    } else if (e.key === 'Enter') {
        calculateExpression();
    }

    console.log(e.key);
});