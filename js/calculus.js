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

export function riemannSum(fn, a, b, n, rule = 'midpoint') {
    if (!fn || n <= 0 || !Number.isFinite(a) || !Number.isFinite(b)) {
        return { area: NaN, rectangles: [] };
    }

    const dx = (b - a) / n;
    let totalArea = 0;
    const rectangles = [];

    for (let i = 0; i < n; i++) {
        const leftX = a + i * dx;
        let sampleX;

        if (rule === 'left') {
            sampleX = leftX;
        } else if (rule === 'right') {
            sampleX = leftX + dx;
        } else {
            sampleX = leftX + 0.5 * dx; // Default to midpoint
        }

        const height = fn(sampleX);
        if (!Number.isFinite(height)) {
            return { area: NaN, rectangles: [] };
        }
        
        totalArea += height * dx;
        rectangles.push({ x: leftX, width: dx, height });
    }

    return { area: totalArea, rectangles };
}