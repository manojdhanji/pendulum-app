// ---------------------------------------------------------
// PendulumRenderer
// Clean, generalized renderer for single and multi pendulums
// ---------------------------------------------------------

export class PendulumRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        // Create a persistent trace buffer
        this.traceCanvas = document.createElement("canvas");
        this.traceCanvas.width = canvas.width;
        this.traceCanvas.height = canvas.height;
        this.traceCtx = this.traceCanvas.getContext("2d");

        // Visual settings
        this.originY = 50;       // anchor height
        this.bobRadius = 10;     // in pixels
        this.rodColor = "#444";
        this.bobColor = "#cc3333";

        // Scale: meters -> pixels
        this.lengthScale = 200;
    }

    // -----------------------------------------------------
    // Utility: clear canvas
    // -----------------------------------------------------
    clear() {
        const { width, height } = this.canvas;
        this.ctx.clearRect(0, 0, width, height);
    }

    // -----------------------------------------------------
    // Utility: convert length (m) -> pixels
    // -----------------------------------------------------
    toPixels(lengthMeters) {
        return lengthMeters * this.lengthScale;
    }

    // -----------------------------------------------------
    // Compute bob position from origin + angle + length
    // -----------------------------------------------------
    computeBob(originX, originY, angle, length) {
        const L = this.toPixels(length);

        return {
            bobX: originX + L * Math.sin(angle),
            bobY: originY + L * Math.cos(angle)
        };
    }

    // -----------------------------------------------------
    // Draw rod
    // -----------------------------------------------------
    drawRod(originX, originY, bobX, bobY) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        ctx.lineTo(bobX, bobY);
        ctx.strokeStyle = this.rodColor;
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    // -----------------------------------------------------
    // Draw bob
    // -----------------------------------------------------
    drawBob(bobX, bobY) {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(bobX, bobY, this.bobRadius, 0, Math.PI * 2);
        ctx.fillStyle = this.bobColor;
        ctx.fill();
    }

    // -----------------------------------------------------
    // Draw a single pendulum (generalized)
    // -----------------------------------------------------
    drawPendulum(originX, originY, angle, length) {
        const { bobX, bobY } = this.computeBob(originX, originY, angle, length);
        this.drawRod(originX, originY, bobX, bobY);
        this.drawBob(bobX, bobY);
    }

    // -----------------------------------------------------
    // Public: draw one pendulum (single mode)
    // -----------------------------------------------------
    draw(angle, length) {
        this.fadeTrace();

        const originX = this.canvas.width / 2;
        const originY = this.originY;

        // Compute bob position ONCE using the correct scale
        const { bobX, bobY } = this.computeBob(originX, originY, angle, length);

        // Draw trace at the exact bob center
        this.drawTracePoint(bobX, bobY);

        // Draw the trace buffer
        this.ctx.drawImage(this.traceCanvas, 0, 0);

        // Draw the pendulum using the same bob coordinates
        this.drawRod(originX, originY, bobX, bobY);
        this.drawBob(bobX, bobY);
    }



    // -----------------------------------------------------
    // Public: draw multiple pendulums (wave machine)
    // -----------------------------------------------------
    drawMultiple(pendulums) {
        this.fadeTrace();

        const originX = this.canvas.width / 2;
        const originY = this.originY;

        // First pass: draw traces
        pendulums.forEach(p => {
            const { bobX, bobY } = this.computeBob(originX, originY, p.angle, p.length);
            this.drawTracePoint(bobX, bobY);
        });

        // Draw the trace buffer
        this.ctx.drawImage(this.traceCanvas, 0, 0);

        // Second pass: draw pendulums
        pendulums.forEach(p => {
            const { bobX, bobY } = this.computeBob(originX, originY, p.angle, p.length);
            this.drawRod(originX, originY, bobX, bobY);
            this.drawBob(bobX, bobY);
        });
    }

    fadeTrace() {
        this.traceCtx.fillStyle = "rgba(0, 0, 0, 0.05)"; // fade speed
        this.traceCtx.fillRect(0, 0, this.traceCanvas.width, this.traceCanvas.height);
    }

    drawTracePoint(x, y) {
        this.traceCtx.fillStyle = "rgba(255, 255, 255, 0.8)";
        this.traceCtx.beginPath();
        this.traceCtx.arc(x, y, 2, 0, Math.PI * 2);
        this.traceCtx.fill();
    }

    resizeTraceCanvas() {
        this.traceCanvas.width = this.canvas.width;
        this.traceCanvas.height = this.canvas.height;
    }
}
