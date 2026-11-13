export class MathParser {
    constructor() {
        this.operators = {
            '+': { precedence: 2, associativity: 'Left'},
            '-': { precedence: 2, associativity: 'Left'},
            '*': { precedence: 3, associativity: 'Left'},
            '/': { precedence: 3, associativity: 'Left'},
            '^': { precedence: 4, associativity: 'Right'}
        };
        this.functions = new Set(['sin', 'cos', 'tan0', 'sqrt', 'abs', 'ln', 'log']);
    }

    // Stage 1: Break string into clean tokens
    tokenize(expression) {
        // Strip spaces and turn leading negatives (like '-x' or '(-x)' into '0-x'
        const cleaned = expression.replace(/\s+/g, '').replace(/(^|\()\-/g, '$10-');
        
        // Split into numbers/decimals, letters (functions/variables), or single operators
        const tokens = cleaned.match(/(\d+\.?\d*|\.\d+|[a-zA-Z]+|[+\-*/^()])/g);
        if (!tokens) throw new Error("Empty or invalid expression.");
        return tokens;
    }

    // Stage 2: Convert Infix tokens to Postfix (Reverse Polish Notation)
    toPostFix(tokens) {
        const outputQueue = [];
        const operatorStack = [];

        for (const token of tokens) {
            if (!isNaN(parseFloat(token))) {
                // Token is a number
                outputQueue.push(parseFloat(token));
            } else if (token === 'x' || token == 'pi' || token === 'e') {
                // Token is a variable or mathematical constant
                outputQueue.push(token);
            } else if (this.functions.has(token)) {
                // Token is a function
                operatorStack.push(token);
            } else if (token in this.operators) {
                // Token is an arithmetic operator 
                const o1 = this.operators[token];
                while (operatorStack.length > 0) {
                    const top = operatorStack[operatorStack.length -1];
                    if (top in this.operators) {
                        const o2 = this.operators[top];
                        if ((o1.associativity === 'Left' && o1.precedence <= o2.precedence) ||
                            (o1.associativity === 'Right' && o1.precedence < o2.precedence)) {
                                outputQueue.push(operatorStack.pop());
                                continue;
                            }
                    }
                    break;
                }
                operatorStack.push(token);
            } else if (token === '(') {
                operatorStack.push(token);
            } else if (token === ')') {
                while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
                    outputQueue.push(operatorStack.pop());
                }
                if (operatorStack.length === 0) {
                    throw new Error("Mismatched parentheses.");
                }
                operatorStack.pop(); // Discard the '('

                // If a function sits at the top of the stack, pop it to the output.
                if (operatorStack.length > 0 && this.functions.has(operatorStack[operatorStack.length - 1])) {
                    outputQueue.push(operatorStack.pop());
                }
            } else {
                throw new Error(`Unknown token: ${token}`);
            }
        }

        // Pop remaining operators to output
        while (operatorStack.length > 0) {
            const top = operatorStack.pop();
            if (top === '(' || top === ')') {
                throw new Error("Mismatched parentheses.");
            }
            outputQueue.push(top);
        }

        return outputQueue;
    }

    // Stage 3: Evaluate Postfix queue for specific value of x
    evaluatePostfix(postfix, xValue) {
        const stack = [];

        for (const token of postfix) {
            if (typeof token === 'number') {
                stack.push(token);
            } else if (token === 'x') {
                stack.push(xValue);
            } else if (token in this.operators) {
                // pop the right operand (b) first, then the left (a)
                const b = stack.pop();
                const a = stack.pop();
                if (token === '+') stack.push(a + b);
                if (token === '-') stack.push(a - b);
                if (token === '*') stack.push(a * b);
                if (token === '/') stack.push(a / b);
                if (token === '^') stack.push(Math.pow(a,b));
            } else if (this.functions.has(token)) {
                const a = stack.pop();
                if (token === 'sin') stack.push(Math.sin(a));
                if (token === 'cos') stack.push(Math.cos(a));
                if (token === 'tan') stack.push(Math.tan(a));
                if (token === 'sqrt') stack.push(Math.sqrt(a));
                if (token === 'abs') stack.push(Math.abs(a));
                if (token === 'ln') stack.push(Math.log(a));
                if (token === 'log') stack.push(Math.log10(a));
            } else if (token === 'pi') {
                stack.push(Math.PI);
            } else if (token === 'e') {
                stack.push(Math.E);
            }
        }

        if (stack.length !== 1) throw new Error("Invalid syntax.");
        return stack[0];
    }

    // Helper method: Compile expression once to evaluate x-values faster
    compile(expression) {
        const tokens = this.tokenize(expression);
        const postfix = this.toPostFix(tokens);
        console.log("Postfix queue for", expression, "->", JSON.stringify(postfix));
        return (x) => this.evaluatePostfix(postfix, x);
    }
}