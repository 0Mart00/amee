// Determinisztikus véletlenszám generátor
const MathEngine = {
    seededRandom: (seed) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    },

    hexToRgb: (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }
};

function gameLoop() {
    if (!ctx) return;

    // Háttér törlése
    ctx.fillStyle = "#001020"; // Mélyvíz szín a pálya szélén túl
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Renderelési tartomány kiszámítása (Frustum culling)
    // Csak azokat a csempéket rajzoljuk ki, amik a kamera nézetébe esnek
    for (let y = 0; y < WORLD_SIZE; y++) {
        for (let x = 0; x < WORLD_SIZE; x++) {
            // Magasság lekérése a generátorból
            const elev = getElevation(x, y, currentSeed);
            
            // Szín lekérése (vizes, homokos, füves, stb.)
            const color = getRichTileColor(elev, x, y, currentSeed);
            
            // Izometrikus rajzolás
            drawIsoTile(x, y, color);
        }
    }

    // Épületek rajzolása
    placedBuildings.forEach(b => {
        drawBuilding(b.x, b.y, b.template);
    });

    // Szellemépület (ha épp építeni akarsz)
    if (selectedTemplate) {
        drawBuilding(mouseGrid.x, mouseGrid.y, selectedTemplate, true);
    }

    requestAnimationFrame(gameLoop);
}