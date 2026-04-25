export class GameRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
    }

    clear() {
        this.ctx.fillStyle = 'rgba(10, 10, 12, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawAura(x, y, radius, color) {
        const time = Date.now() * 0.002;
        this.ctx.save();
        this.ctx.translate(x, y);
        for (let i = 0; i < 6; i++) {
            const angle = (time + i) % Math.PI * 2;
            const px = Math.cos(angle) * (radius + Math.sin(time) * 5);
            const py = Math.sin(angle) * (radius + Math.cos(time) * 5) - (time * 40 % 80);
            this.ctx.beginPath();
            this.ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            this.ctx.fillStyle = color;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = color;
            this.ctx.fill();
        }
        this.ctx.restore();
    }

    drawHero(hero, x, y, mouseX, mouseY) {
        const time = Date.now() * 0.003;
        const breath = Math.sin(time) * 6;
        const dx = (mouseX - x) / 25;
        const dy = (mouseY - y) / 25;

        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.transform(1, dy * 0.012, dx * 0.012, 1, 0, 0);

        this.drawAura(0, 0, 70, hero.colors.primary);

        this.ctx.shadowBlur = 25;
        this.ctx.shadowColor = hero.colors.primary;
        
        const grad = this.ctx.createLinearGradient(0, -90, 0, 90);
        grad.addColorStop(0, hero.colors.primary);
        grad.addColorStop(1, hero.colors.secondary);
        
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.roundRect(-60, -90 - breath, 120, 180 + breath, 20);
        this.ctx.fill();

        // Vẽ biểu tượng vai trò (Role Icon)
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.font = '900 12px Outfit';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(hero.role.toUpperCase(), 0, 70 - breath);

        this.ctx.restore();
    }
}
