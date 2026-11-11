import { Viewport } from './viewport.js';

const canvas = document.getElementById('graph-canvas');
const viewport = new Viewport(canvas);
const resetBtn = document.getElementById('reset-view-btn');
const coordsReadout = document.getElementById('cursor-coords');

function render() {
    viewport.drawGrid();
}

window.addEventListener('resize', () => {
    viewport.resize();
    render();
});

resetBtn.addEventListener('click', () => {
    viewport.reset();
    render();
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const mathX = viewport.toMathX(mouseX).toFixed(2);
    const mathY = viewport.toMathY(mouseY).toFixed(2);
    coordsReadout.textContent = `Cursor: (${mathX}, ${mathY})`;
});

// Initialize canvas on load
viewport.resize();
render();