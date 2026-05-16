// ---------------------------------------------------------
// UI Controller
// Wires DOM controls to the physics engine and animation loop.
// Now supports mode switching (single vs wave machine).
// ---------------------------------------------------------

export function setupUI(physics, controlsAPI) {
    // Grab DOM elements
    const gravitySlider = document.getElementById('gravitySlider');
    const gravityValue  = document.getElementById('gravityValue');

    const lengthSlider  = document.getElementById('lengthSlider');
    const lengthValue   = document.getElementById('lengthValue');
    const lengthLabel   = document.getElementById('lengthLabel');

    const btnPause = document.getElementById('btnPause');
    const btnReset = document.getElementById('btnReset');

    // Mode toggle
    const modeSingle = document.getElementById('modeSingle');
    const modeWave   = document.getElementById('modeWave');

    // -----------------------------
    // Mode switching
    // -----------------------------
    function updateMode() {
        const mode = modeSingle.checked ? "single" : "wave";

        // Update label text to match mode
        lengthLabel.textContent = (mode === "single")
            ? "Length"
            : "Base length";

        // Notify main.js
        controlsAPI.setMode(mode);
    }

    modeSingle.addEventListener('change', updateMode);
    modeWave.addEventListener('change', updateMode);

    // Initialize mode on load
    updateMode();

    // -----------------------------
    // Gravity slider
    // -----------------------------
    gravitySlider.addEventListener('input', () => {
        const g = Number(gravitySlider.value);
        physics.setGravity(g);
        gravityValue.textContent = `${g.toFixed(1)} m/s²`;
        controlsAPI.setGravity?.(g);  // Update gravity change
    });

    // -----------------------------
    // Length slider (Length or Base Length)
    // -----------------------------
    lengthSlider.addEventListener('input', () => {
        const l = Number(lengthSlider.value);
        physics.setLength(l);   // In wave mode, main.js will override this
        lengthValue.textContent = `${l.toFixed(2)} m`;

        // Notify main.js that base length changed (wave mode)
        controlsAPI.setBaseLength?.(l);
    });

    // -----------------------------
    // Pause / Resume button
    // -----------------------------
    btnPause.addEventListener('click', () => {
        if (controlsAPI.isRunning()) {
            controlsAPI.pause();
            btnPause.textContent = "Resume";
        } else {
            controlsAPI.resume();
            btnPause.textContent = "Pause";
        }
    });

    // -----------------------------
    // Reset button
    // -----------------------------
    btnReset.addEventListener('click', () => {
    // Reset physics dynamic state
    physics.reset();

    // Reset simulation engine
    controlsAPI.reset();

    // Reset UI controls
    gravitySlider.value = 9.8;
    gravityValue.textContent = "9.8 m/s²";

    lengthSlider.value = 1;
    lengthValue.textContent = "1.0 m";

    // Reset mode label
    lengthLabel.textContent = (modeSingle.checked ? "Length" : "Base length");

    // Reset period display (only in single mode)
    if (modeSingle.checked) {
        controlsAPI.updatePeriod();
        document.getElementById("periodDisplay").style.display = "block";
    } else {
        document.getElementById("periodDisplay").style.display = "none";
    }
});

}
