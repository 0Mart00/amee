function updateCivDisplay() {
    currentCiv = document.getElementById('civ-select').value;
    document.getElementById('civ-bonus-text').innerText = CIV_DATA[currentCiv].desc;
}

function updatePreview() {
    const pCanvas = document.getElementById('map-preview');
    const pCtx = pCanvas.getContext('2d');
    const seed = parseInt(document.getElementById('map-seed-input').value) || 0;
    const size = 50; const step = pCanvas.width / size;
    for(let y=0; y<size; y++) {
        for(let x=0; x<size; x++) {
            pCtx.fillStyle = getRichTileColor(getElevation(x, y, seed), x, y, seed);
            pCtx.fillRect(x*step, y*step, step+0.5, step+0.5);
        }
    }
}

function openLobby() {
    document.getElementById('menu-container').style.display = 'none';
    document.getElementById('lobby-container').style.display = 'flex';
    updateCivDisplay(); updatePreview();
}

function createBuildMenu() {
    const menu = document.getElementById('build-menu');
    menu.innerHTML = "";
    BUILDING_TEMPLATES.forEach(t => {
        const item = document.createElement('div');
        item.className = 'build-item';
        const cost = Math.floor(t.cost.wood * (t.category === "Katonai" ? CIV_DATA[currentCiv].militaryCostMul : 1.0));
        item.innerHTML = `<span>${t.name}</span> <span style="font-size: 0.7rem;">${cost} Fa</span>`;
        item.onclick = () => {
            selectedTemplate = t;
            document.querySelectorAll('.build-item').forEach(el => el.classList.remove('selected'));
            item.classList.add('selected');
        };
        menu.appendChild(item);
    });
}

function launchGame() {
    document.getElementById('lobby-container').style.display = 'none';
    document.getElementById('game-canvas').style.display = 'block';
    document.getElementById('res-bar').style.display = 'flex';
    document.getElementById('build-menu').style.display = 'flex';
    document.getElementById('ui-overlay').style.display = 'block';
    canvas = document.getElementById('game-canvas');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    ctx = canvas.getContext('2d');
    currentSeed = parseInt(document.getElementById('map-seed-input').value) || 4242;
    createBuildMenu();
    camera.x = -canvas.width / 2; camera.y = (WORLD_SIZE * (TILE_H / 2)) - (canvas.height / 2);
    requestAnimationFrame(gameLoop);
}

window.addEventListener('mousemove', (e) => {
    if (camera.isDragging) { camera.x -= (e.clientX - camera.lastX); camera.y -= (e.clientY - camera.lastY); camera.lastX = e.clientX; camera.lastY = e.clientY; }
    const isoX = e.clientX + camera.x, isoY = e.clientY + camera.y;
    const a = isoX / (TILE_W / 2), b = isoY / (TILE_H / 2);
    mouseGrid = { x: Math.floor((a + b) / 2), y: Math.floor((b - a) / 2) };
    document.getElementById('debug-info').innerText = `X: ${mouseGrid.x}, Y: ${mouseGrid.y} | Civilizáció: ${currentCiv}`;
});

window.addEventListener('mousedown', (e) => {
    if (e.button === 2) { camera.isDragging = true; camera.lastX = e.clientX; camera.lastY = e.clientY; }
    else if (e.button === 0 && selectedTemplate) {
        const cost = Math.floor(selectedTemplate.cost.wood * (selectedTemplate.category === "Katonai" ? CIV_DATA[currentCiv].militaryCostMul : 1.0));
        if (resources.wood >= cost) { 
            placedBuildings.push({x: mouseGrid.x, y: mouseGrid.y, template: selectedTemplate}); 
            resources.wood -= cost; 
            document.getElementById('res-wood').innerText = resources.wood; 
        }
    }
});
window.addEventListener('mouseup', () => camera.isDragging = false);
window.addEventListener('contextmenu', e => e.preventDefault());