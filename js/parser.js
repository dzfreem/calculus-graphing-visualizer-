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

    tokenize(expression) {
        // Strip spaces and turn leading negatives (like '-x' or '(-x)' into '0-x'
        const cleaned = expression.replace(/\s+/g, '').replace(/(^|\()\-/g, '$10-');
        
        // Split into numbers/decimals, letters (functions/variables), or single operators
        const tokens = cleaned.match(/(\d+\.?\d*|\.\d+|[a-zA-Z]+|[+\-*/^()])/g);
        if (!tokens) throw new Error("Empty or invalid expression.");
        return tokens;
    }
}