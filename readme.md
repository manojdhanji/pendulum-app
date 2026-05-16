# Pendulum Simulator App

An interactive web-based physics simulator showcasing single pendulum motion and wave machine dynamics with real-time visualization and adjustable physics parameters.

## Features

- **Single Pendulum Mode**: Simulate a classic simple pendulum with adjustable gravity and length
- **Wave Machine Mode**: Observe a pendulum wave machine with multiple pendulums of varying lengths
- **Real-time Controls**: 
  - Adjust gravity (1-20 m/s²)
  - Modify pendulum length (0.5-2.0 m or base length in wave mode)
  - Pause and resume simulation
  - Reset to initial state
- **Physics Display**: Shows calculated time period (T) and frequency in single pendulum mode
- **Responsive Canvas**: Smooth animation with real-time rendering
- **Dockerized**: Includes Docker setup for easy deployment

## Physics Background

### Simple Harmonic Motion (SHM)

The time period of a simple pendulum for small angles is given by:

```
T = 2π √(l / g)
```

Where:
- **T** = Time period (seconds)
- **l** = Length of pendulum (meters)
- **g** = Acceleration due to gravity (m/s²)

The frequency is the reciprocal of the time period:
```
f = 1 / T
```

### Wave Machine

In wave machine mode, multiple pendulums of increasing lengths are arranged such that their periods form a harmonic series. This creates a beautiful wave-like pattern as the pendulums swing.

## Getting Started

### Prerequisites

- Node.js (for local development)
- Docker and Docker Compose (optional, for containerized deployment)
- A modern web browser (Chrome, Firefox, Safari, Edge)

### Installation & Usage

#### Option 1: Direct Browser Access

1. Clone or download the project
2. Open `index.html` in your web browser
3. Adjust the controls to experiment with different parameters

#### Option 2: Using Docker Compose

1. Navigate to the project directory:
   ```bash
   cd projects/pendulum-app
   ```

2. Start the Docker container:
   ```bash
   docker compose up -d
   ```

3. Open your browser and navigate to `http://localhost:8086`

4. To stop the container:
   ```bash
   docker compose down
   ```

## Project Structure

```
pendulum-app/
├── index.html              # Main HTML file
├── package.json            # Project dependencies
├── docker-compose.yaml     # Docker compose configuration
├── Dockerfile              # Docker image definition
├── styles/                 # Stylesheets
│   ├── main.css           # Main theme and layout
│   ├── controls.css       # Control panel styling
│   └── canvas.css         # Canvas styling
├── src/                    # JavaScript modules
│   ├── main.js            # Application entry point
│   ├── ui.js              # UI controller and event handling
│   ├── pendulumPhysics.js # Physics simulation engine
│   ├── pendulumRenderer.js# Canvas rendering
│   └── layout.js          # Layout management
└── assets/                # Static assets (images, etc.)
```

## File Descriptions

### Core Modules

- **main.js**: Application initialization and simulation loop management
- **ui.js**: Handles DOM controls, event listeners, and mode switching
- **pendulumPhysics.js**: Physics engine calculating pendulum motion equations
- **pendulumRenderer.js**: Canvas rendering and animation
- **layout.js**: UI layout and responsiveness management

### Styles

- **main.css**: Base styling, colors, responsive design
- **controls.css**: Control panel layout and button styling
- **canvas.css**: Canvas container and positioning

## Controls Guide

### Mode Selection
- **Single Pendulum**: Observe a single pendulum's motion
- **Wave Machine**: View multiple pendulums creating a wave pattern

### Gravity Slider
- Adjust gravity from 1 to 20 m/s²
- Lower gravity increases the period of oscillation
- Affects both single and wave machine modes

### Length Slider
- **Single Mode**: Adjust the pendulum length (0.5-2.0 m)
- **Wave Mode**: Adjust base length for the wave machine pendulums

### Buttons
- **Pause**: Pauses the simulation
- **Resume**: Continues from pause
- **Reset**: Resets all values to defaults and restarts the simulation

## Browser Compatibility

- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Technical Details

### Animation Loop
The simulation runs at ~60 FPS using `requestAnimationFrame` for smooth performance.

### Physics Calculations
- Uses the small angle approximation for simple harmonic motion
- Implements velocity Verlet integration for accurate physics
- Recalculates physics parameters in real-time based on user input

### Canvas Rendering
- Hardware-accelerated 2D context rendering
- Dynamic scaling for responsive displays
- Real-time updates without flicker

## Development

### Running Locally

If you want to develop without Docker:

1. Ensure you have a local web server set up (or use VS Code Live Server extension)
2. Open the project in VS Code
3. Start your web server pointing to this directory
4. Edit files in `src/` or `styles/` and refresh your browser

### Building with Docker

```bash
docker compose build --no-cache
docker compose up -d
```

## Notes

- The simulation assumes small angle approximation (typically < 15°)
- The wave machine effect is most visible with multiple pendulums
- Performance may vary based on browser capabilities and system resources

## Future Enhancements

- [ ] Add damping/friction simulation
- [ ] Export simulation data to CSV
- [ ] Displacement and first and second derivatives diagram display
- [ ] Custom pendulum configuration
- [ ] Animation speed control

## License

This project is provided as-is for educational purposes.

## Credits

Built as an educational physics simulation tool to demonstrate harmonic motion, wave mechanics, and JavaScript canvas rendering.
