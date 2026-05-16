// src/main.js

import { PendulumPhysics } from './pendulumPhysics.js';
import { PendulumRenderer } from './pendulumRenderer.js';
import { LayoutManager } from './layout.js';
import { setupUI } from './ui.js';
const canvas = document.getElementById('pendulumCanvas');

// -----------------------------
// Simulation State
// -----------------------------
let mode = "single";
let baseLength = 1;
let gravity = 9.8;

let singlePendulum = createSinglePendulum(gravity, baseLength);
let pendulumArray = [];

// -----------------------------
// Core modules
// -----------------------------
const renderer = new PendulumRenderer(canvas);

// -----------------------------
// Animation loop state
// -----------------------------
let lastTime = null;
let running = true;

// -----------------------------
// Single pendulum setup
// -----------------------------
function createSinglePendulum(gravity = 9.8, baseLength = 1) {
    return new PendulumPhysics({ g: gravity, length: baseLength });
}

// -----------------------------
// Wave Machine Setup
// -----------------------------
function createWaveMachine() {
    const count = 5;
    const L0 = baseLength;

    pendulumArray = [];
    for (let i = 0; i < count; i++) {
        const L = L0 + i * 0.1;
        pendulumArray.push(createSinglePendulum(gravity, L));
    }
}

// -----------------------------
// Draw System
// -----------------------------
function drawSystem() {
    if (mode === "single") {
        renderer.draw(singlePendulum.angle, singlePendulum.length);
    } else {
        renderer.drawMultiple(pendulumArray);
    }
}

// -----------------------------
// Update period and frequency display based on current base length and gravity
// -----------------------------
function updatePeriodDisplay() {
    const T = 2 * Math.PI * Math.sqrt(baseLength / gravity);
    const f = 1 / T;

    document.getElementById("periodValue").textContent = T.toFixed(3) + " s";
    document.getElementById("frequencyValue").textContent = f.toFixed(3) + " Hz";
}

// -----------------------------
// Controls API
// -----------------------------
const controlsAPI = {
    pause: () => { running = false; },
    resume: () => {
        if (!running) {
            running = true;
            lastTime = null;
            requestAnimationFrame(loop);
        }
    },
    reset: () => {
        lastTime = null;

        // Reset global values
        gravity = 9.8;
        baseLength = 1;
        renderer.traceCtx.clearRect(0, 0, renderer.traceCanvas.width, renderer.traceCanvas.height);

        // Recreate pendulum(s)
        if (mode === "single") {
            singlePendulum = createSinglePendulum(gravity, baseLength);
        } else {
            createWaveMachine();
        }

        updatePeriodDisplay();
        drawSystem();
    },

    isRunning: () => running,

    setMode: (newMode) => {
        mode = newMode;

        if (mode === "single") {
            singlePendulum = createSinglePendulum(gravity, baseLength);
            document.getElementById("periodDisplay").style.display = "block";
        } else {
            createWaveMachine();

        }
        updatePeriodDisplay();
        drawSystem();
    },

    setBaseLength: (L) => {
        baseLength = L;

        if (mode === "single") {
            singlePendulum.setLength(L);
        } else {
            createWaveMachine();
        }
        updatePeriodDisplay();
        drawSystem();
    },
    setGravity: (g) => {
        gravity = g;

        if (mode === "single") {
            singlePendulum.setGravity(g);
        } else {
            pendulumArray.forEach(p => p.setGravity(g));
        }

        updatePeriodDisplay();
    },
    updatePeriod: () => updatePeriodDisplay()
};

// -----------------------------
// Wire UI
// -----------------------------
setupUI(singlePendulum, controlsAPI);

// -----------------------------
// Layout Manager (MUST be last)
// -----------------------------
const layout = new LayoutManager(canvas, () => {
    renderer.resizeTraceCanvas();
    drawSystem();
});

// -----------------------------
// Animation loop
// -----------------------------
function loop(timestamp) {
    if (!running) return;

    if (lastTime == null) {
        lastTime = timestamp;
    }

    let dt = (timestamp - lastTime) / 1000;

    // Clamp dt to avoid huge jumps when tab was inactive
    dt = Math.min(dt, 0.05);

    lastTime = timestamp;

    if (mode === "single") {
        singlePendulum.update(dt);
    } else {
        pendulumArray.forEach(p => p.update(dt));
    }

    drawSystem();
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
