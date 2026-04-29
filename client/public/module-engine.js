function drawIsoTile(x, y, color) {
    const sx = (x - y) * (TILE_W / 2) - camera.x;
    const sy = (x + y) * (TILE_H / 2) - camera.y;
    if (sx + TILE_W < 0 || sx > window.innerWidth || sy + TILE_H < 0 || sy > window.innerHeight) return;
    ctx.beginPath();
    ctx.moveTo(sx + TILE_W/2, sy); ctx.lineTo(sx + TILE_W, sy + TILE_H/2);
    ctx.lineTo(sx + TILE_W/2, sy + TILE_H); ctx.lineTo(sx, sy + TILE_H/2);
    ctx.closePath();
    ctx.fillStyle = color; ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.1)"; ctx.stroke();
}

function drawBuilding(x, y, template, isGhost = false) {
    const sx = (x - y) * (TILE_W / 2) - camera.x;
    const sy = (x + y) * (TILE_H / 2) - camera.y;
    const w = template.size[0], d = template.size[1], h = template.id >= 30 ? 50 : 25;
    const cx = sx + TILE_W/2, cy = sy + TILE_H/2;
    ctx.fillStyle = isGhost ? "rgba(255,255,255,0.4)" : (template.category === "Katonai" ? "#4a5a7a" : "#7a5c3d");
    ctx.beginPath();
    ctx.moveTo(cx, cy - h); ctx.lineTo(cx + (TILE_W*w)/2, cy + (TILE_H*w)/4 - h);
    ctx.lineTo(cx, cy + (TILE_H*(w+d))/4 - h); ctx.lineTo(cx - (TILE_W*d)/2, cy + (TILE_H*d)/4 - h);
    ctx.closePath(); ctx.fill(); ctx.stroke();
}

function gameLoop() {
    if (!ctx) return;
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const center = { x: Math.floor((camera.x/(TILE_W/2) + camera.y/(TILE_H/2))/2), y: Math.floor((camera.y/(TILE_H/2) - camera.x/(TILE_W/2))/2) };
    for (let sum = 0; sum <= 2 * WORLD_SIZE; sum++) {
        for (let x = 0; x <= sum; x++) {
            let y = sum - x;
            if (x < WORLD_SIZE && y < WORLD_SIZE) {
                if (Math.abs(x - center.x) + Math.abs(y - center.y) > 40) continue;
                drawIsoTile(x, y, getRichTileColor(getElevation(x, y, currentSeed), x, y, currentSeed));
                if (selectedTemplate && x === mouseGrid.x && y === mouseGrid.y) drawBuilding(x, y, selectedTemplate, true);
                const b = placedBuildings.find(pb => pb.x === x && pb.y === y);
                if (b) drawBuilding(x, y, b.template);
            }
        }
    }
    requestAnimationFrame(gameLoop);
}