import { Viewport } from './viewport.js';
import { MathParser } from './parser.js';
import { drawCurve, drawTangentLine, drawRiemannRectangles } from './plotter.js';
import { numericalDerivative, riemannSum } from './calculus.js';

const canvas = document.getElementById('graph-canvas');
const viewport = new Viewport(canvas);
const parser = new MathParser();

const functionInput = document.getElementById('function-input');
const resetBtn = document.getElementById('reset-view-btn');
const coordsReadout = document.getElementById('cursor-coords');
const tangentToggle = document.getElementById('tangent-toggle');
const derivativeReadout = document.getElementById('derivative-readout')
const integralToggle = document.getElementById('integral-toggle');
const boundAInput = document.getElementById('bound-a');
const boundBInput = document.getElementById('bound-b');
const subintervalsInput = document.getElementById('subintervals-n');
const riemannRuleSelect = document.getElementById('riemann-rule');
const integralReadout = document.getElementById('integral-readout');
const syntaxError = document.getElementById('syntax-error');
const presetButtons = document.querySelectorAll('.preset-btn');

let currentFn = null;
let hoverMathX = null;
// Mouse state
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;

function updateFunction() {
    const expression = functionInput.value.trim();
    if (!expression) {
        currentFn = null;
        functionInput.style.borderColor = '#475569';
        syntaxError.hidden = true;
        render();
        return;
    }

    try {
        currentFn = parser.compile(expression);
        functionInput.style.borderColor = '#475569';
        syntaxError.hidden = true;
    } catch (err) {
        // keep the last valid curve or clear it, and highlight input red on syntax error.
        functionInput.style.borderColor = '#ef4444';
        syntaxError.textContent = err.message || 'Invalid expression syntax';
        syntaxError.hidden = false;
    }
    render();
}

function render() {
    viewport.drawGrid();
    
    // Handling integrals
    if(currentFn && integralToggle.checked){
        const a = parseFloat(boundAInput.value);
        const b = parseFloat(boundBInput.value);
        const n = Math.min(500, Math.max(1, parseInt(subintervalsInput.value, 10) || 1));
        const rule = riemannRuleSelect.value;

        const { area, rectangles } = riemannSum(currentFn, a, b, n, rule);
        if (Number.isFinite(area)) {
            drawRiemannRectangles(viewport.ctx, viewport, rectangles);
            integralReadout.textContent = `Area ~ ${area.toFixed(5)}`;
        } else {
            integralReadout.textContent = `Area ~ Undefined`;
        }
    } else {
        integralReadout.textContent = `Area ~ --`;
    }

    drawCurve(viewport.ctx, viewport, currentFn);

    if (currentFn && tangentToggle.checked && hoverMathX !== null) {
        const slope = numericalDerivative(currentFn, hoverMathX);
        if (Number.isFinite(slope)) {
            drawTangentLine(viewport.ctx, viewport, currentFn, hoverMathX, slope);
            derivativeReadout.textContent = `f'(${hoverMathX.toFixed(2)}) = ${slope.toFixed(4)}`;
        } else {
            derivativeReadout.textContent = `f'(${hoverMathX.toFixed(2)}) = Undefined`;
        }
    } else {
        derivativeReadout.textContent = `f'(x) = --`;
    }
}

functionInput.addEventListener('input', updateFunction);

presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        functionInput.value = btn.dataset.fn;
        updateFunction();
    });
})

tangentToggle.addEventListener('change', render);

[integralToggle, boundAInput, boundBInput, subintervalsInput, riemannRuleSelect].forEach(el => {
    el.addEventListener('input', render);
});

integralToggle.addEventListener('change', render);

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
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = 'grabbing';
});

// Stop Dragging
canvas.addEventListener('mouseup', (e) => {
    if (isDragging) {
        isDragging = false;
        canvas.releasePointerCapture(e.pointerId);
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
    }

    hoverMathX = viewport.toMathX(mouseX);
    const mathY = viewport.toMathY(mouseY);
    coordsReadout.textContent = `Cursor: (${hoverMathX.toFixed(2)}, ${mathY.toFixed(2)})`;

    render();
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
updateFunction();