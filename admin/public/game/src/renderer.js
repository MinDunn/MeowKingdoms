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

    getTierVisuals(tier) {
        // Ánh xạ 6 Bậc sang Màu sắc Hào quang và Cường độ (Intensity)
        switch(tier) {
            case 1: return { color: '#ffffff', intensity: 1, radius: 80 }; // Thường (Trắng)
            case 2: return { color: '#55efc4', intensity: 2, radius: 90 }; // Cơ Bản (Lục)
            case 3: return { color: '#4bcffa', intensity: 3, radius: 100 }; // Hiếm (Lam)
            case 4: return { color: '#e056fd', intensity: 4, radius: 110 }; // Sử Thi (Tím)
            case 5: return { color: '#f1c40f', intensity: 6, radius: 125 }; // Huyền Thoại (Cam)
            case 6: return { color: '#ff7675', intensity: 8, radius: 140 }; // Thần Thoại (Đỏ)
            default: return { color: '#ffffff', intensity: 1, radius: 80 };
        }
    }

    getHeroEmoji(heroId) {
        // Sinh ra một icon ngẫu nhiên nhưng cố định dựa trên tên/ID tướng
        const emojis = ['🐱', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🦁', '🐯', '🦊', '🐺'];
        if (!heroId) return '🐱';
        let sum = 0;
        for (let i = 0; i < heroId.length; i++) sum += heroId.charCodeAt(i);
        return emojis[sum % emojis.length];
    }

    drawAura(x, y, radius, color, intensity = 2) {
        const time = Date.now() * 0.001;
        this.ctx.save();
        this.ctx.translate(x, y);
        
        // Độ đậm (Alpha) tăng theo Bậc tướng
        this.ctx.globalAlpha = 0.2 + (intensity * 0.05);
        
        // Số vòng hào quang nhiều hay ít phụ thuộc vào Bậc
        const layers = Math.min(5, Math.max(1, Math.floor(intensity / 2) + 1));
        
        for (let i = 0; i < layers; i++) {
            // Tốc độ đập (scale) mạnh hơn đối với tướng bậc cao
            const scale = 1 + Math.sin(time * (1 + i * 0.2) + i) * (0.1 + intensity * 0.015);
            this.ctx.beginPath();
            this.ctx.ellipse(0, 50, radius * scale * (1 - i * 0.1), radius * 0.3 * scale, 0, 0, Math.PI * 2);
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = (4 - i) + (intensity * 0.5);
            this.ctx.stroke();
            
            // Độ tỏa sáng (Glow) tăng cực mạnh ở Bậc cao
            this.ctx.shadowBlur = 10 + (intensity * 5);
            this.ctx.shadowColor = color;
        }
        this.ctx.restore();
    }

    drawHero(hero, x, y, mouseX, mouseY, spriteImg) {
        const time = Date.now() * 0.002;
        const breath = Math.sin(time) * 8; // More pronounced breathing for lobby
        const dx = (mouseX - x) / 50;
        const dy = (mouseY - y) / 50;

        // Lấy cấu hình Đồ họa (Visuals) dựa theo Bậc
        const tierVisuals = this.getTierVisuals(hero.tier || 1);

        this.ctx.save();
        this.ctx.translate(x, y);
        
        // Vẽ Hào Quang dưới chân (Áp dụng màu & cường độ theo Tier)
        this.drawAura(0, 40, tierVisuals.radius, tierVisuals.color, tierVisuals.intensity);

        // 3D Tilt Effect
        this.ctx.transform(1, dy * 0.008, dx * 0.008, 1, 0, 0);

        if (spriteImg) {
            // Render Sprite đồ họa thực tế (Đã chuẩn bị sẵn logic cho tương lai)
            const w = 300;
            const h = 300;
            this.ctx.shadowBlur = tierVisuals.intensity * 4; // Tướng cũng phát sáng nhẹ theo màu bậc
            this.ctx.shadowColor = tierVisuals.color;
            this.ctx.drawImage(spriteImg, -w/2, -h/2 - 20 - breath, w, h);
        } else {
            // High-quality placeholder (Emoji)
            this.ctx.font = '90px Outfit';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            // Phát sáng cực mạnh theo màu của Bậc
            this.ctx.shadowBlur = 10 + (tierVisuals.intensity * 3);
            this.ctx.shadowColor = tierVisuals.color;
            this.ctx.fillStyle = '#fff';
            
            // Random mặt mèo dựa theo ID để các tướng không bị trùng 1 mặt
            const emoji = this.getHeroEmoji(hero.id || hero.name);
            this.ctx.fillText(emoji, 0, -40 - breath);
            
            // Decorative light pillars (Cột sáng bốc lên)
            this.ctx.fillStyle = tierVisuals.color + '22'; // 22 is hex for low opacity
            this.ctx.shadowBlur = 0; // Tắt glow cho cột sáng
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
        
        // Fix lỗi hiển thị undefined, dùng giá trị mặc định là 1
        const displayLevel = hero.level || 1;
        this.ctx.fillText(`Lv.${displayLevel}`, 0, 5);
        this.ctx.restore();

        // --- NAME TAG BELOW (3Q STYLE) ---
        this.ctx.save();
        this.ctx.translate(0, 110);
        
        // Rank tag with purple background
        this.ctx.font = '900 12px Outfit';
        this.ctx.textAlign = 'center';
        const rankText = hero.roleName || hero.rank || '[Chưa Rõ]';
        const rankWidth = this.ctx.measureText(rankText).width + 10;
        
        this.ctx.fillStyle = 'rgba(80, 0, 80, 0.9)';
        this.ctx.beginPath();
        this.ctx.roundRect(-rankWidth/2, 10, rankWidth, 20, 4);
        this.ctx.fill();
        
        this.ctx.fillStyle = '#ff00ff';
        this.ctx.fillText(rankText, 0, 24);

        // Enhancement label (+0) & Name
        this.ctx.font = '900 16px Outfit';
        this.ctx.shadowBlur = 4;
        this.ctx.shadowColor = '#000';
        
        // Fix lỗi hiển thị undefined, dùng giá trị mặc định là 0
        const displayEnh = hero.enh || 0;
        const fullName = `${hero.name}+${displayEnh}`;
        
        // Màu tên tướng khớp với màu Bậc Khung!
        this.ctx.fillStyle = tierVisuals.color; 
        this.ctx.fillText(fullName, 0, 0);
        
        this.ctx.restore();

        this.ctx.restore();
    }
}



