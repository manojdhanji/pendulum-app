// ---------------------------------------------------------
// Pendulum Physics Module (Model)
// ---------------------------------------------------------

export class PendulumPhysics {
    constructor({ g = 9.8, length = 1, initialAngle = Math.PI / 4 } = {}) {
        this.g = g;
        this.length = length;

        // State variables
        this.angle = initialAngle;
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
    }

    // θ'' = -(g / L) * sin(θ)
    update(dt) {
        this.angularAcceleration = -(this.g / this.length) * Math.sin(this.angle);
        this.angularVelocity += this.angularAcceleration * dt;
        this.angle += this.angularVelocity * dt;
    }

    reset(initialAngle = Math.PI / 4) {
        this.angle = initialAngle;
        this.angularVelocity = 0;
        this.angularAcceleration = 0;
    }

    setGravity(g) {
        this.g = g;
    }

    setLength(l) {
        this.length = l;
    }
}
