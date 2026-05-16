// ---------------------------------------------------------
// PendulumRenderer
// Clean, generalized renderer for single and multi pendulums
// ---------------------------------------------------------

export class PendulumRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

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
        this.clear();

        const originX = this.canvas.width / 2;
        const originY = this.originY;

        this.drawPendulum(originX, originY, angle, length);
    }

    // -----------------------------------------------------
    // Public: draw multiple pendulums (wave machine)
    // -----------------------------------------------------
    drawMultiple(pendulums) {
        this.clear();

        const originX = this.canvas.width / 2;   // all pendulums share the same pivot
        const originY = this.originY;

        pendulums.forEach((p) => {
            this.drawPendulum(originX, originY, p.angle, p.length);
        });
    }

}
