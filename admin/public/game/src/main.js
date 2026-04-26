import { GameRenderer } from './renderer.js';
import { HERO_DATA } from './data.js';

class GameClient {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.renderer = new GameRenderer(this.canvas, this.ctx);

        this.mouseX = 0;
        this.mouseY = 0;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        // Start Game Loop
        this.render();
        console.log("Meow Kingdoms Lobby - System Online");
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    render() {
        this.renderer.clear();

        // Draw Squad of 5 Heroes
        const squad = [
            { ...HERO_DATA.CAT_KNIGHT, level: 99, enh: 12, rank: '[Vương Giả]' },
            { ...HERO_DATA.CAT_MAGE, level: 85, enh: 10, rank: '[Hiền Triết]' },
            { ...HERO_DATA.CAT_ASSASSIN, level: 92, enh: 11, rank: '[Ảnh Tử]' },
            { ...HERO_DATA.CAT_KNIGHT, level: 70, enh: 8, rank: '[Chiến Binh]' },
            { ...HERO_DATA.CAT_MAGE, level: 65, enh: 5, rank: '[Tập Sự]' }
        ];

        const spacing = 220; // Distance between heroes
        const startX = (this.canvas.width - (squad.length - 1) * spacing) / 2;
        const centerY = this.canvas.height / 2 + 180; // Lowered to stand on the road floor

        squad.forEach((hero, index) => {
            const x = startX + index * spacing;
            // Perfectly straight line formation
            this.renderer.drawHero(hero, x, centerY, this.mouseX, this.mouseY);
        });

        requestAnimationFrame(() => this.render());
    }
}

// Start the client
new GameClient();
