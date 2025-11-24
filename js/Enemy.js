class Enemy {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.width = width;
        this.height = height;
        this.speed = 40 + Math.random() * 30;
        this.direction = 1;
        this.moveDistance = 0;
        this.maxMoveDistance = 120;
    }
    
    update(deltaTime) {
        // Движение врага вперед-назад
        this.x += this.speed * this.direction * deltaTime;
        this.moveDistance += Math.abs(this.speed * deltaTime);
        
        // Смена направления
        if (this.moveDistance >= this.maxMoveDistance) {
            this.direction *= -1;
            this.moveDistance = 0;
        }
    }
    
    draw(ctx) {
        // Тело врага
        ctx.fillStyle = '#E74C3C';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Глаза врага
        ctx.fillStyle = '#2C3E50';
        const eyeOffset = this.direction > 0 ? 5 : this.width - 15;
        ctx.fillRect(this.x + eyeOffset, this.y + 8, 8, 8);
        
        // Рот врага
        ctx.fillStyle = '#C0392B';
        ctx.fillRect(this.x + 10, this.y + this.height - 15, this.width - 20, 5);
        
        // Анимация движения
        ctx.fillStyle = '#C0392B';
        const legOffset = Math.sin(Date.now() * 0.01) * 3;
        ctx.fillRect(this.x + 5, this.y + this.height, 6, 8 + legOffset);
        ctx.fillRect(this.x + this.width - 11, this.y + this.height, 6, 8 - legOffset);
    }
}

class FlyingEnemy extends Enemy {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.startY = y;
        this.speed = 60;
        this.maxMoveDistance = 80;
        this.flyHeight = 50;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // Парящее движение
        this.y = this.startY + Math.sin(Date.now() * 0.005) * this.flyHeight;
    }
    
    draw(ctx) {
        // Тело летающего врага
        ctx.fillStyle = '#9B59B6';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Крылья
        ctx.fillStyle = '#8E44AD';
        ctx.fillRect(this.x - 5, this.y + 5, 5, this.height - 10);
        ctx.fillRect(this.x + this.width, this.y + 5, 5, this.height - 10);
        
        // Глаза
        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(this.x + 8, this.y + 8, 6, 6);
        
        // Эффект полета
        ctx.strokeStyle = '#8E44AD';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height / 2);
        ctx.lineTo(this.x - 10, this.y + this.height / 2);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

class FastEnemy extends Enemy {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.speed = 100 + Math.random() * 50;
        this.maxMoveDistance = 200;
    }
    
    draw(ctx) {
        // Тело быстрого врага
        ctx.fillStyle = '#E67E22';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Глаза
        ctx.fillStyle = '#2C3E50';
        ctx.fillRect(this.x + 5, this.y + 5, 4, 4);
        ctx.fillRect(this.x + this.width - 9, this.y + 5, 4, 4);
        
        // Эффект скорости
        ctx.fillStyle = 'rgba(230, 126, 34, 0.5)';
        for (let i = 0; i < 3; i++) {
            ctx.fillRect(this.x - i * 5 - 2, this.y + 2, 3, this.height - 4);
        }
    }
}