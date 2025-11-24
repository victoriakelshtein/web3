class MovingPlatform {
    constructor(x, y, width, height, moveX, moveY, color = '#3498DB') {
        this.x = x;
        this.y = y;
        this.startX = x;
        this.startY = y;
        this.width = width;
        this.height = height;
        this.moveX = moveX; // Расстояние движения по X
        this.moveY = moveY; // Расстояние движения по Y
        this.color = color;
        this.speed = 0.5; // Скорость движения (0-1 за секунду)
        this.direction = 1;
        this.progress = 0;
        this.lastTime = 0;
    }
    
    update(deltaTime) {
        this.progress += this.direction * this.speed * deltaTime;
        
        // Ограничение прогресса от 0 до 1
        if (this.progress >= 1) {
            this.progress = 1;
            this.direction = -1;
        } else if (this.progress <= 0) {
            this.progress = 0;
            this.direction = 1;
        }
        
        // Плавное движение с ease-in-out
        const easedProgress = this.easeInOut(this.progress);
        this.x = this.startX + this.moveX * easedProgress;
        this.y = this.startY + this.moveY * easedProgress;
    }
    
    easeInOut(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }
    
    draw(ctx) {
        // Основная платформа
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Текстура
        ctx.fillStyle = this.darkenColor(this.color, 20);
        ctx.fillRect(this.x, this.y, this.width, 3);
        ctx.fillRect(this.x, this.y + this.height - 3, this.width, 3);
        
        // Индикатор движения
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        const indicatorWidth = this.width * 0.8;
        const indicatorX = this.x + (this.width - indicatorWidth) / 2;
        ctx.fillRect(indicatorX, this.y + this.height / 2 - 1, indicatorWidth * this.progress, 2);
        
        // Стрелки направления
        ctx.fillStyle = 'white';
        if (this.moveX > 0) {
            // Стрелка вправо
            ctx.beginPath();
            ctx.moveTo(this.x + this.width - 5, this.y + this.height / 2);
            ctx.lineTo(this.x + this.width - 15, this.y + this.height / 2 - 5);
            ctx.lineTo(this.x + this.width - 15, this.y + this.height / 2 + 5);
            ctx.closePath();
            ctx.fill();
        } else if (this.moveX < 0) {
            // Стрелка влево
            ctx.beginPath();
            ctx.moveTo(this.x + 5, this.y + this.height / 2);
            ctx.lineTo(this.x + 15, this.y + this.height / 2 - 5);
            ctx.lineTo(this.x + 15, this.y + this.height / 2 + 5);
            ctx.closePath();
            ctx.fill();
        }
        
        if (this.moveY > 0) {
            // Стрелка вниз
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y + this.height - 5);
            ctx.lineTo(this.x + this.width / 2 - 5, this.y + this.height - 15);
            ctx.lineTo(this.x + this.width / 2 + 5, this.y + this.height - 15);
            ctx.closePath();
            ctx.fill();
        } else if (this.moveY < 0) {
            // Стрелка вверх
            ctx.beginPath();
            ctx.moveTo(this.x + this.width / 2, this.y + 5);
            ctx.lineTo(this.x + this.width / 2 - 5, this.y + 15);
            ctx.lineTo(this.x + this.width / 2 + 5, this.y + 15);
            ctx.closePath();
            ctx.fill();
        }
    }
    
    darkenColor(color, percent) {
        const num = parseInt(color.slice(1), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
}