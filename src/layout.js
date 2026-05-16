// ---------------------------------------------------------
// Layout Manager
// Keeps the canvas resolution in sync with CSS size
// and notifies the renderer when resized.
// ---------------------------------------------------------

export class LayoutManager {
    constructor(canvas, onResize = null) {
        this.canvas = canvas;
        this.onResize = onResize;

        // Initial sizing
        this.resizeCanvas();

        // Listen for window resizes
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    // Sync internal canvas resolution with CSS size
    resizeCanvas() {
        const { canvas } = this;

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        // Only resize if dimensions actually changed
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;

            // Notify renderer (if provided)
            if (this.onResize) {
                this.onResize(width, height);
            }
        }
    }
}
