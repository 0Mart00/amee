let canvas, ctx;
        const WORLD_SIZE = 128;
        const TILE_W = 64;
        const TILE_H = 32;
        
        let currentCiv = "Magyarok";
        let currentSeed = 4242;
        let selectedTemplate = null;
        let mouseGrid = {x: 0, y: 0};
        let camera = {x: 0, y: 0, isDragging: false, lastX: 0, lastY: 0};
        const placedBuildings = [];
        const resources = {wood: 500, stone: 300, gold: 200};

        const CIV_DATA = {
            "Magyarok": { militaryCostMul: 0.85, buildSpeedMul: 1.0, hpMul: 1.0, desc: "Huszár bónusz: Katonai épületek 15%-kal olcsóbbak." },
            "Brittek": { militaryCostMul: 1.0, buildSpeedMul: 1.0, hpMul: 1.1, desc: "Íjászat bónusz: +10% HP az épületekre." },
            "Vikingek": { militaryCostMul: 1.0, buildSpeedMul: 1.0, hpMul: 1.2, desc: "Berserker bónusz: +20% HP minden épületre." },
            "Franciák": { militaryCostMul: 1.0, buildSpeedMul: 0.8, hpMul: 1.0, desc: "Lovagi bónusz: 20%-kal gyorsabb építés." }
        };

        class Building {
            constructor(id, name, hp, armor, attack, range, los, capacity, buildTime, cost, size, category) {
                this.id = id; this.name = name; this.hp = hp; this.armor = armor;
                this.attack = attack; this.range = range; this.los = los; this.garrisonCapacity = capacity;
                this.buildTime = buildTime; this.cost = cost; this.size = size; this.category = category;
            }
        }

        const BUILDING_TEMPLATES = [
            new Building(10, "Ház", 500, "2/2", 0, 0, 4, 5, 20, {wood: 50, stone: 0}, [1, 1], "Alap"),
            new Building(11, "Farm", 100, "0/0", 0, 0, 1, 0, 15, {wood: 60, stone: 0}, [2, 2], "Alap"),
            new Building(20, "Kaszárnya", 1200, "5/5", 0, 0, 6, 10, 50, {wood: 175, stone: 0}, [3, 3], "Katonai"),
            new Building(30, "Őrtorony", 800, "3/5", 5, 6, 8, 5, 60, {wood: 25, stone: 125}, [1, 1], "Katonai"),
            new Building(40, "Börtön", 2000, "10/10", 0, 0, 5, 20, 100, {wood: 100, stone: 200}, [3, 3], "Speciális")
        ];