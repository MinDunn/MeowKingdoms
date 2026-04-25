import { HERO_DATA } from './data.js';
import { GameRenderer } from './renderer.js';

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const renderer = new GameRenderer(canvas, ctx);

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

const battleUnits = [
    { data: HERO_DATA.CAT_KNIGHT, x: canvas.width * 0.25, y: canvas.height * 0.5 },
    { data: HERO_DATA.CAT_MAGE, x: canvas.width * 0.5, y: canvas.height * 0.5 },
    { data: HERO_DATA.CAT_ASSASSIN, x: canvas.width * 0.75, y: canvas.height * 0.5 }
];

function gameLoop() {
    renderer.clear();

    ctx.font = '600 16px Outfit';
    ctx.fillStyle = 'rgba(0, 242, 255, 0.6)';
    ctx.textAlign = 'center';
    ctx.fillText('MEOW KINGDOMS: PURE CODE EDITION', canvas.width / 2, 80);

    battleUnits.forEach(unit => {
        renderer.drawHero(unit.data, unit.x, unit.y, mouseX, mouseY);
    });

    requestAnimationFrame(gameLoop);
}

gameLoop();
