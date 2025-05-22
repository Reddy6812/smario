# smario

Super Mario-style platformer built with Phaser 3.

Live demo: https://reddy6812.github.io/smario/

## Getting Started

Clone the repository and navigate into it:

```
git clone https://github.com/Reddy6812/smario.git
cd smario
```

Open `index.html` directly in your browser, or for best compatibility run a local HTTP server:

```
# using Python 3
python3 -m http.server 8080
# or using Node
npx http-server . -p 8080
```

Then visit `http://localhost:8080`.

## Controls

- Left/Right arrows: move
- Up arrow: jump

## Features

- Tilemap-based level from Phaser labs
- Collectible stars (+10 score each)
- Camera follows the player across the map
- Automatic restart if you fall off the level
- **Bike Race mini-game** accessible via the "Bike Race" button (arrow keys to move, R to restart)

## License

MIT