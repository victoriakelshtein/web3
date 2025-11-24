class Coin {
    constructor(x, y, radius = 12) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }
    
    draw(ctx) {
        // Анимация вращения и парения
        const rotation = Date.now() * 0.005;
        const floatOffset = Math.sin(Date.now() * 0.003) * 3;
        
        ctx.save();
        ctx.translate(this.x, this.y + floatOffset);
        ctx.rotate(rotation);
        
        // Внешний круг с градиентом
        const gradient = ctx.createRadialGradient(0, 0, this.radius * 0.5, 0, 0, this.radius);
        gradient.addColorStop(0, '#F1C40F');
        gradient.addColorStop(1, '#F39C12');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Внутренний круг
        ctx.fillStyle = '#D35400';
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Блики
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.arc(-this.radius * 0.3, -this.radius * 0.3, this.radius * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Полоска в центре
        ctx.fillStyle = '#F1C40F';
        ctx.fillRect(-this.radius * 0.8, -this.radius * 0.1, this.radius * 1.6, this.radius * 0.2);
        
        ctx.restore();
        
        // Эффект свечения
        ctx.shadowColor = '#F1C40F';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y + floatOffset, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}