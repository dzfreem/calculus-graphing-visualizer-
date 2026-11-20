export function numericalDerivative(fn, x, h = 1e-5) {
    const yCenter = fn(x);
    if (!Number.isFinite(yCenter)) {
        return NaN;
    }

    const yPlus = fn(x + h);
    const yMinus = fn(x - h);

    if (!Number.isFinite(yPlus) || !Number.isFinite(yMinus)) {
        return NaN;
    }

    const slope = (yPlus - yMinus) / (2 * h);

    if (Math.abs(slope) > 1e6) {
        return NaN;
    }

    return slope;
}