export class GameRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.bgImage = null;
    }

    setBackground(image) {
        this.bgImage = image;
    }

    clear() {
        if (this.bgImage) {
            this.ctx.drawImage(this.bgImage, 0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.ctx.fillStyle = '#111';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    drawAura(x, y, radius, color) {
        const time = Date.now() * 0.001;
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.globalAlpha = 0.3;
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = color;
        
        for (let i = 0; i < 2; i++) {
            const scale = 1 + Math.sin(time + i) * 0.1;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 80, radius * scale, radius * 0.3 * scale, 0, 0, Math.PI * 2);
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        }
        this.ctx.restore();
    }

    drawHero(hero, x, y, mouseX, mouseY, spriteImg) {
        const time = Date.now() * 0.002;
        const breath = Math.sin(time) * 4;
        const dx = (mouseX - x) / 60;
        const dy = (mouseY - y) / 60;

        this.ctx.save();
        this.ctx.translate(x, y);
        
        // Brighter Floor Glow
        this.drawAura(0, 0, 90, hero.colors.primary);

        this.ctx.transform(1, dy * 0.005, dx * 0.005, 1, 0, 0);

        if (spriteImg) {
            const w = 260;
            const h = 260;
            this.ctx.drawImage(spriteImg, -w/2, -h/2 - 20 - breath, w, h);
        }

        // --- LVL BADGE ABOVE ---
        this.ctx.save();
        this.ctx.translate(0, -140 - breath);
        this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
        this.ctx.beginPath();
        this.ctx.roundRect(-25, -12, 50, 24, 5);
        this.ctx.fill();
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
        
        this.ctx.font = '900 14px Outfit';
        this.ctx.fillStyle = '#fff';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Lv.${hero.level}`, 0, 5);
        this.ctx.restore();

        // --- NAME TAG BELOW (3Q STYLE) ---
        this.ctx.save();
        this.ctx.translate(0, 110);
        
        // Rank tag with purple background
        this.ctx.font = '900 12px Outfit';
        this.ctx.textAlign = 'center';
        const rankText = hero.rank || '[Thích Sử]';
        const rankWidth = this.ctx.measureText(rankText).width + 10;
        
        this.ctx.fillStyle = 'rgba(80, 0, 80, 0.9)';
        this.ctx.beginPath();
        this.ctx.roundRect(-rankWidth/2, 10, rankWidth, 20, 4);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#ff00ff';
        this.ctx.fillText(rankText, 0, 24);

        // Enhancement label (+7) & Name
        this.ctx.font = '900 16px Outfit';
        this.ctx.shadowBlur = 4;
        this.ctx.shadowColor = '#000';
        
        const fullName = `${hero.name}+${hero.enh}`;
        this.ctx.fillStyle = '#ffcc00'; // Gold
        this.ctx.fillText(fullName, 0, 0);
        
        this.ctx.restore();

        this.ctx.restore();
    }
}



