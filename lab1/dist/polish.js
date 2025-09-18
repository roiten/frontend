"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let digits;
let operands;
const operators = ['+', '-', '*', '/'];
function calc(expression) {
    digits = [];
    operands = [];
    if (expression) {
        console.log("Значение из input: " + expression);
        const expressionArray = parseExpression(expression);
        const result = countExpression(expressionArray);
        if (result)
            console.log("Результат:", result);
        else
            console.log("Некорректное выражение");
    }
    else {
        console.log('пустое выражение');
    }
}
function parseExpression(expression) {
    let preparedString = "";
    for (let char of expression) {
        if (char === "(" || char === ")") {
            preparedString += " " + char + " ";
        }
        else {
            preparedString += char;
        }
    }
    return preparedString.trim().split(/\s+/);
}
function countExpression(elements) {
    const element = elements.shift();
    if (!element)
        return null;
    if (!isNaN(parseFloat(element))) {
        const num = parseFloat(element);
        digits.push(num);
        return num;
    }
    if (element === "(") {
        const value = countExpression(elements);
        if (!value)
            return null;
        if (elements.shift() !== ")") {
            return null;
        }
        return value;
    }
    if (operators.includes(element)) {
        operands.push(element);
        const num1 = countExpression(elements);
        const num2 = countExpression(elements);
        if (num1 && num2) {
            const result = calculate(num1, num2, element);
            if (result) {
                digits.push(result);
            }
            return result;
        }
    }
    return null;
}
function calculate(num1, num2, operate) {
    switch (operate) {
        case "+":
            return num1 + num2;
        case "-":
            return num1 - num2;
        case "*":
            return num1 * num2;
        case "/":
            return num1 / num2;
        default:
            return null;
    }
}
calc("(+ (* 2 3) 4)"); // 10 = (2*3)+4
calc("(* (+ 1 2) (+ 3 4))"); // 21 = (1+2)*(3+4)
calc("(/ (* 6 4) (+ 2 2))"); // 6 = (6*4)/(2+2)
calc("(+ (* (+ 1 2) 3) 4)"); // 13 = ((1+2)*3)+4
calc("* (+ 6 7");
//# sourceMappingURL=polish.js.map