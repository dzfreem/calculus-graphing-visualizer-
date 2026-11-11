export class Viewport {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scale = 50; // Pixels per 1 mathematical unit
        this.offsetX = 0; // Origin shift in pixels
        this.offsetY = 0;
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

        const startX = Math.floor(this.toMathX(0));
        const endX = Math.ceil(this.toMathX(canvas.width));
        for (let x = startX; x <= endX; x++) {
            const px = this.toScreenX(x);
            ctx.beginPath();
            ctx.moveTo(px, 0);
            ctx.lineTo(px, canvas.height);
            ctx.stroke();
        }

        const startY = Math.floor(this.toMathY(canvas.height));
        const endY = Math.ceil(this.toMathY(0));
        for (let y = startY; y <= endY; y++) {
            const py = this.toScreenY(y);
            ctx.beginPath();
            ctx.moveTo(0, py);
            ctx.lineTo(canvas.width, py);
            ctx.stroke();
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