import { Viewport } from './viewport.js';
import { MathParser } from './parser.js';

// Testing parser
const parser = new MathParser();
console.log(parser.tokenize("2 * x^2 + sin(x)"));

const canvas = document.getElementById('graph-canvas');
const viewport = new Viewport(canvas);
const resetBtn = document.getElementById('reset-view-btn');
const coordsReadout = document.getElementById('cursor-coords');

// Mouse state
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

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

// Start Dragging
canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    canvas.style.cursor = 'grabbing';
});

// Testing touchpad event listener
canvas.addEventListener('pointerdown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    canvas.style.cursor = 'grabbing';
});

// Stop Dragging
canvas.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        canvas.style.cursor = 'crosshair';
    }
});

// Handle panning & live coordinate readout
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    if (isDragging) {
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;

        viewport.pan(dx, dy);
        render();
    }

    const mathX = viewport.toMathX(mouseX).toFixed(2);
    const mathY = viewport.toMathY(mouseY).toFixed(2);
    coordsReadout.textContent = `Cursor: (${mathX}, ${mathY})`;
});

// Handle cursor-anchored zooming
canvas.addEventListener('wheel', (e) => {
    e.preventDefault(); // Prevents browser page scrolling
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Scroll up (negative deltaY) zooms in: scroll down zooms out
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    viewport.zoomAt(mouseX, mouseY, zoomFactor);
    render();
}, { passive: false});

// Initialize canvas on load
viewport.resize();
render();