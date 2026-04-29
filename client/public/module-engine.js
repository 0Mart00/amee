function drawIsoTile(x, y, color) {
    const sx = (x - y) * (TILE_W / 2) - camera.x;
    const sy = (x + y) * (TILE_H / 2) - camera.y;

    if (sx + TILE_W < 0 || sx > window.innerWidth || sy + TILE_H < 0 || sy > window.innerHeight) return;

    ctx.beginPath();
    ctx.moveTo(sx + TILE_W / 2, sy);
    ctx.lineTo(sx + TILE_W + 0.5, sy + TILE_H / 2); // +0.5 pixel a hézagok ellen
    ctx.lineTo(sx + TILE_W / 2, sy + TILE_H + 0.5);
    ctx.lineTo(sx - 0.5, sy + TILE_H / 2);
    ctx.closePath();
    
    ctx.fillStyle = color;
    ctx.fill();
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