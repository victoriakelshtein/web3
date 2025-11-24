class Platform {
    constructor(x, y, width, height, color = '#2ECC71') {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
    
    draw(ctx) {
        // Основная платформа
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        if (this.color === '#E74C3C') {
            // Опасная платформа с шипами
            ctx.fillStyle = '#C0392B';
            for (let i = 0; i < this.width; i += 15) {
                ctx.beginPath();
                ctx.moveTo(this.x + i, this.y);
                ctx.lineTo(this.x + i + 7, this.y - 8);
                ctx.lineTo(this.x + i + 14, this.y);
                ctx.closePath();
                ctx.fill();
            }
            
            // Мигающий эффект для опасных платформ
            if (Math.sin(Date.now() * 0.005) > 0) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        } else {
            // Обычная платформа с текстурой
            ctx.fillStyle = this.color === '#7D3C98' ? '#6C3483' : '#27AE60';
            ctx.fillRect(this.x, this.y, this.width, 5);
            ctx.fillRect(this.x, this.y + this.height - 5, this.width, 5);
            
            // Текстура травы для обычных платформ
            if (this.color === '#2ECC71') {
                ctx.fillStyle = '#229954';
                for (let i = 0; i < this.width; i += 8) {
                    ctx.fillRect(this.x + i, this.y - 3, 2, 3);
                }
            }
        }
    }
}