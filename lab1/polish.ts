type ParseResult = { success: true; value: string[] } | { success: false; error: string };
type CountResult = { success: true; value: number } | { success: false; error: string };

const operators: string[] = ['+', '-', '*', '/'];
const allTokens: string[] = [...operators, '0', '1', '2', '3',
    '4', '5', '6', '7', '8', '9', ' '];

function calc(expression: string): void {
    if (!expression) {
        console.log("Пустое выражение");
        return;
    }

    console.log("Значение из input:", expression);

    const parsed = parseExpression(expression);
    if (!parsed.success) {
        console.log("Ошибка:", parsed.error);
        return;
    }

    const result = countExpression(parsed.value);
    if (!result.success) {
        console.log("Ошибка:", result.error);
        return;
    }

    console.log("Результат:", result.value);
}

function parseExpression(expression: string): ParseResult {
    let preparedString = "";
    for (const char of expression) {
        if (char === "(" || char === ")") {
            preparedString += " " + char + " ";
        } else {
            if (allTokens.includes(char)) {
                preparedString += char;
            } else {
                return { success: false, error: `Неизвестный символ: ${char}` };
            }
        }
    }
    return { success: true, value: preparedString.trim().split(/\s+/) };
}

function countExpression(elements: string[]): CountResult {
    const element = elements.shift();

    if (typeof element === "undefined") {
        return { success: false, error: "Неожиданный конец выражения" }
    }

    if (!isNaN(parseFloat(element))) {
        return { success: true, value: parseFloat(element) };
    }

    // подвыражение
    if (element === "(") {
        const inner = countExpression(elements);
        if (!inner.success) return inner;

        if (elements.shift() !== ")") {
            return { success: false, error: "Нет закрывающей скобки )" };
        }
        return inner;
    }

    // производим арифметические действия при встрече оператора
    if (operators.includes(element)) {
        const num1 = countExpression(elements);
        if (!num1.success) return num1;

        const num2 = countExpression(elements);
        if (!num2.success) return num2;

        return calculate(num1.value, num2.value, element);
    }

    return { success: false, error: `Некорректный элемент выражения: ${element}` };
}

function calculate(num1: number, num2: number, operator: string): CountResult {
    switch (operator) {
        case "+": return { success: true, value: num1 + num2 };
        case "-": return { success: true, value: num1 - num2 };
        case "*": return { success: true, value: num1 * num2 };
        case "/":
            if (num2 === 0) return { success: false, error: "Деление на ноль" };
            return { success: true, value: num1 / num2 };
        default:
            return { success: false, error: "Неизвестная операция" };
    }
}

calc("(+ (* 2 3) 4)"); // 10
calc("(* (+ 1 2) (+ 3 4))"); // 21
calc("(/ (* 6 4) (+ 2 2))"); // 6
calc("(+ (* (+ 1 2) 3) 4)"); // 13
calc("* (+ 6 7");
calc("* (@ 6 7");


