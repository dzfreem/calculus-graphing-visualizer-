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