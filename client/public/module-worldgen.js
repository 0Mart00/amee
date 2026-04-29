function hash(x, y, s) {
    const n = Math.sin(x * 12.9898 + y * 78.233 + s) * 43758.5453123;
    return n - Math.floor(n);
}

function getElevation(x, y, s) {
    let v = 0; let f = 0.05; let a = 1;
    for(let i=0; i<3; i++) {
        const xi = Math.floor(x * f); const yi = Math.floor(y * f);
        const xf = (x * f) - xi; const yf = (y * f) - yi;
        const v1 = hash(xi, yi, s + i); const v2 = hash(xi+1, yi, s + i);
        const v3 = hash(xi, yi+1, s + i); const v4 = hash(xi+1, yi+1, s + i);
        v += (v1*(1-xf)+v2*xf)*(1-yf)*a + (v3*(1-xf)+v4*xf)*yf*a;
        f *= 2.0; a *= 0.5;
    }
    return v / 1.75;
}

const TERRAIN_COLORS = {
    WATER: {r: 0, g: 61, b: 122}, SAND: {r: 212, g: 184, b: 149},
    GRASS: {r: 59, g: 99, b: 38}, FOREST: {r: 30, g: 61, b: 12}, MOUNTAIN: {r: 85, g: 82, b: 77}
};

function getRichTileColor(v, x, y, seed) {
    let base = TERRAIN_COLORS.GRASS;
    if (v < 0.35) base = TERRAIN_COLORS.WATER;
    else if (v < 0.42) base = TERRAIN_COLORS.SAND;
    else if (v > 0.85) base = TERRAIN_COLORS.MOUNTAIN;
    else if (v > 0.70) base = TERRAIN_COLORS.FOREST;
    const noiseVal = (hash(x, y, seed * 1.5) - 0.5) * 15;
    return `rgb(${Math.max(0, Math.min(255, base.r + noiseVal))},${Math.max(0, Math.min(255, base.g + noiseVal))},${Math.max(0, Math.min(255, base.b + noiseVal))})`;
}