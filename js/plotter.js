export function drawCurve(ctx, viewport, fn, color = '#2563eb') {
    if (!fn) return;
    
    const width = viewport.canvas.width;
    const height = viewport.canvas.height;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    let isDrawing = false;
    let prevPy = null;

    for (let px = 0; px <= width; px++) {
        const mathX = viewport.toMathX(px);
        let mathY;

        try {
            mathY = fn(mathX);
        } catch {
            isDrawing = false;
            continue;
        }

        // Break the path for undefined domains (e.g., sqrt(-1), ln(0))
        if (!Number.isFinite(mathY)) {
            isDrawing = false;
            prevPy = null;
            continue;
        }

        const py = viewport.toScreenY(mathY);

        // Break the path if a vertical asymptote causes a massive off-screen jump
        const isAsymptoteJump = prevPy !== null && 
            Math.abs(py - prevPy) > height && 
            ((py < 0 && prevPy > height) || (py > height && prevPy < 0));
        
        if (!isDrawing || isAsymptoteJump) {
            ctx.moveTo(px, py);
            isDrawing = true;
        } else {
            ctx.lineTo(px, py);
        }

        prevPy = py;
    }

    ctx.stroke();
    ctx.restore();
}

export function drawTangentLine(ctx, viewport, fn, mathX, slope, color = '#ef4444') {
    if (!fn || !Number.isFinite(slope)) return;

    const mathY = fn(mathX);
    if (!Number.isFinite(mathY)) return;

    // Find the left and right math bounds of the visible screen
    const leftX = viewport.toMathX(0);
    const rightX = viewport.toMathX(viewport.canvas.width);

    // Calculate tangent line Y-values at both screen edges: y = m(x - x0) + y0
    const leftY = slope * (leftX - mathX) + mathY;
    const rightY = slope * (rightX - mathX) + mathY;

    ctx.save();

    // 1. Draw the dahed tangent line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(0, viewport.toScreenY(leftY));
    ctx.lineTo(viewport.canvas.width, viewport.toScreenY(rightY));
    ctx.stroke();

    // 2. Draw a solid point of tangent on the curve
    ctx.setLineDash([]);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(viewport.toScreenX(mathX), viewport.toScreenY(mathY), 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
}   