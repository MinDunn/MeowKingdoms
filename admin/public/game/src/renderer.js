export class GameRenderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.bgImage = new Image();
        this.bgImage.src = 'assets/lobby_bg.png';
        this.particles = [];
        this.initParticles();
    }

    initParticles() {
        for (let i = 0; i < 30; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: 5 + Math.random() * 10,
                speedX: -1 - Math.random() * 2,
                speedY: 1 + Math.random() * 2,
                rotation: Math.random() * Math.PI,
                rotationSpeed: Math.random() * 0.05
            });
        }
    }

    updateParticles() {
        this.particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            p.rotation += p.rotationSpeed;
            if (p.y > this.canvas.height) { p.y = -20; p.x = Math.random() * this.canvas.width; }
            if (p.x < -20) { p.x = this.canvas.width + 20; }
        });
    }

    clear() {
        this.updateParticles();
        // Draw Background with Parallax/Scale
        if (this.bgImage.complete) {
            this.ctx.drawImage(this.bgImage, 0, 0, this.canvas.width, this.canvas.height);
            
            // Add soft vignette
            const grad = this.ctx.createRadialGradient(this.canvas.width/2, this.canvas.height/2, 0, this.canvas.width/2, this.canvas.height/2, this.canvas.width);
            grad.addColorStop(0, 'rgba(0,0,0,0)');
            grad.addColorStop(1, 'rgba(0,0,0,0.5)');
            this.ctx.fillStyle = grad;
            this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
        } else {
            this.ctx.fillStyle = '#1e3799';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // Draw Particles (Sakura Petals)
        this.ctx.fillStyle = '#ffb7c5'; // Pink Sakura
        this.particles.forEach(p => {
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    drawAura(x, y, radius, color) {
        const time = Date.now() * 0.001;
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.globalAlpha = 0.4;
        
        // Multi-layered aura for depth
        for (let i = 0; i < 3; i++) {
            const scale = 1 + Math.sin(time * (1 + i * 0.2) + i) * 0.15;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 50, radius * scale * (1 - i * 0.1), radius * 0.3 * scale, 0, 0, Math.PI * 2);
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 4 - i;
            this.ctx.stroke();
            
            // Inner glow
            this.ctx.shadowBlur = 30;
            this.ctx.shadowColor = color;
        }
        this.ctx.restore();
    }

    drawHero(hero, x, y, mouseX, mouseY, spriteImg) {
        const time = Date.now() * 0.002;
        const breath = Math.sin(time) * 8; // More pronounced breathing for lobby
        const dx = (mouseX - x) / 50;
        const dy = (mouseY - y) / 50;

        this.ctx.save();
        this.ctx.translate(x, y);
        
        // Floor Aura
        this.drawAura(0, 40, 90, hero.colors.primary);

        // 3D Tilt Effect
        this.ctx.transform(1, dy * 0.008, dx * 0.008, 1, 0, 0);

        if (spriteImg) {
            const w = 300;
            const h = 300;
            this.ctx.drawImage(spriteImg, -w/2, -h/2 - 20 - breath, w, h);
        } else {
            // High-quality placeholder
            this.ctx.font = '90px Outfit';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = hero.colors.primary;
            this.ctx.fillStyle = '#fff';
            this.ctx.fillText('🐱', 0, -40 - breath);
            
            // Decorative light pillars
            this.ctx.fillStyle = hero.colors.primary + '22';
            this.ctx.fillRect(-45, -200 - breath, 90, 160);
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



