function drawIsoTile(x, y, color) {
    // AoE2 stílusú koordináta transzformáció
    const sx = (x - y) * (TILE_W / 2) - camera.x;
    const sy = (x + y) * (TILE_H / 2) - camera.y;

    // Frustum culling (csak azt rajzoljuk, ami a képernyőn van)
    if (sx + TILE_W < 0 || sx > window.innerWidth || sy + TILE_H < 0 || sy > window.innerHeight) return;

    ctx.beginPath();
    // A rombusz pontjai (AoE2 szög)
    ctx.moveTo(sx + TILE_W / 2, sy);               // Felső csúcs
    ctx.lineTo(sx + TILE_W + 0.5, sy + TILE_H / 2); // Jobb csúcs
    ctx.lineTo(sx + TILE_W / 2, sy + TILE_H + 0.5); // Alsó csúcs
    ctx.lineTo(sx - 0.5, sy + TILE_H / 2);         // Bal csúcs
    ctx.closePath();
    
    ctx.fillStyle = color;
    ctx.fill();
    
    // Opcionális: nagyon vékony rácsvonal az AoE2 DE érzéshez
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.lineWidth = 1;
    ctx.stroke();
}

// Egér koordináta számítása (Visszafele vetítés)
function getMouseGrid(clientX, clientY) {
    const isoX = clientX + camera.x - (TILE_W / 2); // Fél csempe korrekció
    const isoY = clientY + camera.y;
    
    const a = isoX / (TILE_W / 2);
    const b = isoY / (TILE_H / 2);
    
    return {
        x: Math.floor((b + a) / 2),
        y: Math.floor((b - a) / 2)
    };
}

window.addEventListener('mousemove', (e) => {
    if (camera.isDragging) {
        camera.x -= (e.clientX - camera.lastX);
        camera.y -= (e.clientY - camera.lastY);
        camera.lastX = e.clientX;
        camera.lastY = e.clientY;
    }

    // Kamera és TILE_W/2 korrekció a pontos grid illesztéshez
    const isoX = e.clientX + camera.x - (TILE_W / 2);
    const isoY = e.clientY + camera.y;

    const a = isoX / (TILE_W / 2);
    const b = isoY / (TILE_H / 2);

    // Az eltolásmentes koordináták
    mouseGrid.x = Math.floor((a + b) / 2);
    mouseGrid.y = Math.floor((b - a) / 2);
    
    const debug = document.getElementById('debug-info');
    if (debug) debug.innerText = `X: ${mouseGrid.x}, Y: ${mouseGrid.y}`;
});