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

        // Force vector colors (styling only)
        this.colorDown = "#ffffff";         // mg
        this.colorRadial = "#4A90E2";       // mg·cosθ and T
        this.colorTangential = "#F5A623";
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
    draw(angle, length, showForces = false, g = 9.8) {

        const originX = this.canvas.width / 2;
        const originY = this.originY;

        const { bobX, bobY } = this.computeBob(originX, originY, angle, length);

        if (!showForces) {
            this.fadeTrace();
            this.drawTracePoint(bobX, bobY);
            this.ctx.drawImage(this.traceCanvas, 0, 0);
        }

        this.drawRod(originX, originY, bobX, bobY);
        this.drawBob(bobX, bobY);

        if (showForces) {
            this.drawForces(bobX, bobY, angle);
            this.drawLegend();
        }
    }


    // -----------------------------------------------------
    // Public: draw multiple pendulums (wave machine)
    // -----------------------------------------------------
    drawMultiple(pendulums, showForces = false, g = 9.8) {

        const originX = this.canvas.width / 2;
        const originY = this.originY;

        if (!showForces) {
            // Running -> fade + update trace
            this.fadeTrace();

            pendulums.forEach(p => {
                const { bobX, bobY } = this.computeBob(originX, originY, p.angle, p.length);
                this.drawTracePoint(bobX, bobY);
            });
        }

        // Always draw the trace buffer ONCE
        this.ctx.drawImage(this.traceCanvas, 0, 0);

        // Draw pendulums
        pendulums.forEach(p => {
            const { bobX, bobY } = this.computeBob(originX, originY, p.angle, p.length);

            this.drawRod(originX, originY, bobX, bobY);
            this.drawBob(bobX, bobY);

            if (showForces) {
                this.drawForces(bobX, bobY, p.angle);
                this.drawLegend();
            }
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

    drawForces(bobX, bobY, angle) {
        // -----------------------------
        // 1. Physics-only calculations
        // -----------------------------
        const forceScale = 40;

        // Unit vectors
        const sinA = Math.sin(angle);
        const cosA = Math.cos(angle);

        // Radial direction (along rod)
        const radX = sinA;
        const radY = cosA;

        // Tangential direction (perpendicular to rod)
        const tanX = cosA;
        const tanY = -sinA;

        // Components (normalized)
        const mgDown = {
            x: 0,
            y: forceScale
        };

        const mgSin = {
            x: tanX * (-sinA) * forceScale,
            y: tanY * (-sinA) * forceScale
        };

        const mgCos = {
            x: radX * cosA * forceScale,
            y: radY * cosA * forceScale
        };

        const tension = {
            x: -mgCos.x,
            y: -mgCos.y
        };


        // -----------------------------
        // 2. Rendering-only (styling)
        // -----------------------------
        this.drawArrow(bobX, bobY, bobX + mgDown.x, bobY + mgDown.y, this.colorDown);
        this.drawArrow(bobX, bobY, bobX + mgSin.x, bobY + mgSin.y, this.colorTangential);
        this.drawArrow(bobX, bobY, bobX + mgCos.x, bobY + mgCos.y, this.colorRadial);
        this.drawArrow(bobX, bobY, bobX + tension.x, bobY + tension.y, this.colorRadial);
    }

    drawArrow(x1, y1, x2, y2, color) {
        const ctx = this.ctx;

        // Draw main line
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Arrowhead size
        const headLength = 10;

        // Compute angle of the line
        const angle = Math.atan2(y2 - y1, x2 - x1);

        // Arrowhead points
        const hx1 = x2 - headLength * Math.cos(angle - Math.PI / 6);
        const hy1 = y2 - headLength * Math.sin(angle - Math.PI / 6);

        const hx2 = x2 - headLength * Math.cos(angle + Math.PI / 6);
        const hy2 = y2 - headLength * Math.sin(angle + Math.PI / 6);

        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(hx1, hy1);
        ctx.lineTo(hx2, hy2);
        ctx.closePath();
        ctx.fill();
    }

    drawLegend() {
        const ctx = this.ctx;
        ctx.save();

        const x = this.canvas.width - 180;
        let y = 20;

        ctx.font = "14px sans-serif";
        ctx.textAlign = "left";

        const drawItem = (label, color) => {
            // Color box
            ctx.fillStyle = color;
            ctx.fillRect(x, y - 10, 12, 12);

            // Text
            ctx.fillStyle = "white";
            ctx.fillText(label, x + 20, y);
            y += 22;
        };

        drawItem("mg (down)", this.colorDown);
        drawItem("mg·cosθ (radial)", this.colorRadial);
        drawItem("Tension (opposite radial)", this.colorRadial);
        drawItem("mg·sinθ (tangential)", this.colorTangential);

        ctx.restore();
    }
}
