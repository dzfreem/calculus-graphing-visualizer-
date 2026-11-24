# calculus-graphing-visualizer-

# Interactive 2D Calculus & Graphing Visualizer

A dependency-free, browser-based function plotter and numerical calculus visualizer built from scratch using HTML5 Canvas and modular ES6 JavaScript.

## Live Demo
**[Launch Interactive Visualizer](https://github.io)** *(Update with your GitHub username after enabling Pages)*

## Key Features & Technical Highlights

* **Safe Shunting-Yard Math Parser (`js/parser.js`)**: Tokenizes user input and converts infix expressions into Reverse Polish Notation (Postfix) with full PEMDAS precedence and right-associative exponentiation, eliminating security risks from JavaScript's `eval()`.
* **Dynamic Viewport & Cursor-Anchored Zoom (`js/viewport.js`)**: Implements real-time affine transformations between Cartesian math space and inverted HTML5 Canvas screen pixels, supporting 1:1 pointer panning, cursor-stationary zooming, and edge-clamped axis labels.
* **Asymptote & Discontinuity Detection (`js/plotter.js`)**: Samples functions across screen-space pixels and breaks rendering paths across vertical asymptotes (e.g., `1/x`, `tan(x)`) and undefined domains (`sqrt(x)` for x < 0).
* **Numerical Differentiation (`js/calculus.js`)**: Approximates instantaneous derivatives using the O(h²) Central Difference Quotient formula `f'(x) ≈ (f(x + h) - f(x - h)) / (2h)` with asymptote spike rejection, rendering a live tangent line at the cursor.
* **Numerical Integration (`js/calculus.js`)**: Computes definite integrals using Left Endpoint, Right Endpoint, and Midpoint Riemann sums across configurable subintervals, rendering signed area rectangles on the grid.

## Project Structure

```text
calculus-graphing-visualizer/
├── index.html          # Semantic layout, sidebar controls, and HTML5 Canvas
├── style.css           # Responsive flex/grid dashboard styling
└── js/
    ├── main.js         # Application state, pointer/wheel events, and render loop
    ├── viewport.js     # Coordinate space conversions, grid rendering, pan/zoom
    ├── parser.js       # Lexer, Shunting-yard RPN compiler, and stack evaluator
    ├── plotter.js      # Curve sampling, asymptote detection, tangent & area overlays
    └── calculus.js     # Central difference derivative and Riemann sum algorithms
```

## Running Locally

Because this project uses native ES6 modules without third-party build tools, serve it with any static HTTP server:

```bash
git clone https://github.com
cd calculus-graphing-visualizer
python3 -m http.server 8000
```
