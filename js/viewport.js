export class Viewport {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scale = 50; // Pixels per 1 mathematical unit
        this.offsetX = 0; // Origin shift in pixels
        this.offsetY = 0;
        this.minScale = 5;
        this.maxScale = 500;
    }

    resize() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
        if (this.offsetX === 0 && this.offsetY === 0) {
            this.reset();
        }
    }

    reset() {
        this.scale = 50;
        this.offsetX = this.canvas.width / 2;
        this.offsetY = this.canvas.height / 2;
    }

    // Shift origin offsets by pixel drag distance
    pan(dx, dy) {
        this.offsetX += dx;
        this.offsetY += dy;
    }

    // Zoom while keeping the math coordinate under (mouseX, mouseY) stationary
    zoomAt(mouseX, mouseY, zoomFactor) {
        const mathX = this.toMathX(mouseX);
        const mathY = this.toMathY(mouseY);

        const newScale = Math.min(this.maxScale, Math.max(this.minScale, this.scale * zoomFactor));
        this.scale = newScale;

        this.offsetX = mouseX - (mathX * this.scale);
        this.offsetY = mouseY + (mathY * this.scale);
    }

    // Convert math X to screen pixel X
    toScreenX(mathX) {
        return this.offsetX + (mathX * this.scale);
    }

    // Convert math Y to screen pixel Y (inverted because screen Y goes down)
    toScreenY(mathY) {
        return this.offsetY - (mathY * this.scale);
    }

    // Convert screen pixel X to math X
    toMathX(screenX) {
        return (screenX - this.offsetX) / this.scale;
    }

    // Convert screen pixel Y to math Y
    toMathY(screenY) {
        return (this.offsetY - screenY) / this.scale;
    }

    drawGrid() {
        const { ctx, canvas } = this;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw minor grid lines
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;

        // Configure tick label styling
        ctx.fillStyle = '#64748b';
        ctx.font = '12px sans0serif';

        // Clamp label positions so numbers stick to screen edges if axes pan off-screen
        const labelY = Math.min(Math.max(this.offsetY + 16, 16), canvas.height - 8);
        const labelX = Math.min(Math.max(this.offsetX - 8, 28), canvas.width -8);
        
        // Vertical Grid Lines & X-Axis Labels
        const startX = Math.floor(this.toMathX(0));
        const endX = Math.ceil(this.toMathX(canvas.width));
        ctx.textAlign = 'center';

        for (let x = startX; x <= endX; x++) {
            const px = this.toScreenX(x);

            // Draw Vertical grid line
            ctx.beginPath();
            ctx.moveTo(px, 0);
            ctx.lineTo(px, canvas.height);
            ctx.stroke();

            // Draw X-axis number (skip 0 to prevent overlap at origin)
            if (x !== 0) {
                // Position at px horizontally, and 16 pixels below the X-axis line
                ctx.fillText(x.toString(), px, this.offsetY + 16);
            }
        }

        // Horizontal Grid Lines & Y-Axis Labels
        const startY = Math.floor(this.toMathY(canvas.height));
        const endY = Math.ceil(this.toMathY(0));
        ctx.textAlign = 'right';

        for (let y = startY; y <= endY; y++) {
            const py = this.toScreenY(y);
        
            // Draw horizontal grid line
            ctx.beginPath();
            ctx.moveTo(0, py);
            ctx.lineTo(canvas.width, py);
            ctx.stroke();

            // Draw Y-axis number (skipping 0 as with X-axis)
            if (y !== 0) {
                // Position 8 pixels to the left of the Y-axis line, and 4 pixels down to vertically center the font
                ctx.fillText(y.toString(), this.offsetX - 8, py + 4);
            }
        }

        // Draw primary X and Y axes
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;

        // Y-Axis
        ctx.beginPath();
        ctx.moveTo(this.offsetX, 0);
        ctx.lineTo(this.offsetX, canvas.height);
        ctx.stroke();

        // X-Axis
        ctx.beginPath();
        ctx.moveTo(0, this.offsetY);
        ctx.lineTo(canvas.width, this.offsetY);
        ctx.stroke();
    }
}
