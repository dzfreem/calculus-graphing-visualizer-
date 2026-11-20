export function numericalDerivative(fn, x, h = 1e-5) {
    const yPlus = fn(x+h);
    const yMinus = fn(x-h);

    if (!Number.isFinite(yPlus) || !Number.isFinite(yMinus)) {
        return NaN;
    }
    
    return (yPlus - yMinus) / (2 * h);
}