function openLobby() {
    document.getElementById('menu-container').style.display = 'none';
    document.getElementById('lobby-container').style.display = 'flex';
    updatePreview();
}

function randomizeSeed() {
    const newSeed = Math.floor(Math.random() * 999999);
    document.getElementById('map-seed-input').value = newSeed;
    updatePreview();
}

function updatePreview() {
    const pCanvas = document.getElementById('map-preview');
    const pCtx = pCanvas.getContext('2d');
    const seed = parseInt(document.getElementById('map-seed-input').value) || 0;
    
    const size = 50; 
    const step = pCanvas.width / size;
    
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    for(let y=0; y<size; y++) {
        for(let x=0; x<size; x++) {
            // A WORLD_SIZE-hoz arányosított mintavételezés
            const worldX = Math.floor((x / size) * WORLD_SIZE);
            const worldY = Math.floor((y / size) * WORLD_SIZE);
            const elev = getElevation(worldX, worldY, seed);
            pCtx.fillStyle = getRichTileColor(elev, worldX, worldY, seed);
            pCtx.fillRect(x * step, y * step, step, step);
        }
    }
}

function launchGame() {
    // 1. UI elemek kezelése
    document.getElementById('lobby-container').style.display = 'none';
    canvas = document.getElementById('game-canvas');
    canvas.style.display = 'block';
    
    // 2. Kontextus és méretezés
    ctx = canvas.getContext('2d', { alpha: false }); // Performance boost
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // 3. Adatok beállítása a lobby-ból
    currentSeed = parseInt(document.getElementById('map-seed-input').value) || 4242;
    currentCiv = document.getElementById('civ-select').value;
    
    // 4. Kamera pozicionálása a pálya "tetejéhez" (izometrikus észak)
    // Így nem a sötét semmiben kezdesz
    camera.x = -canvas.width / 2;
    camera.y = 0; 

    // 5. Build menü inicializálása (ha van ilyen függvényed)
    if (typeof createBuildMenu === "function") createBuildMenu();
    
    console.log("Játék indítása...", {seed: currentSeed, civ: currentCiv});

    // 6. Játék hurok indítása
    requestAnimationFrame(gameLoop);
}
// Egér és Grid szinkronizáció (Megszünteti az elcsúszást)
window.addEventListener('mousemove', (e) => {
    // Kamera mozgatása (jobb egérgombbal, mint az RTS-ekben)
    if (camera.isDragging) {
        camera.x -= (e.clientX - camera.lastX);
        camera.y -= (e.clientY - camera.lastY);
        camera.lastX = e.clientX;
        camera.lastY = e.clientY;
    }
    
    // Egér pozíció átszámítása világ-koordinátákra (AoE2 inverz mátrix)
    const worldX = e.clientX + camera.x;
    const worldY = e.clientY + camera.y;
    
    // A 2:1 arányú izometrikus rács visszafejtése
    const gridX = Math.floor((worldY / (TILE_H)) + (worldX / (TILE_W)));
    const gridY = Math.floor((worldY / (TILE_H)) - (worldX / (TILE_W)));
    
    mouseGrid.x = gridX;
    mouseGrid.y = gridY;
    
    const debug = document.getElementById('debug-info');
    if (debug) debug.innerText = `Kordináta: ${gridX}, ${gridY}`;
});