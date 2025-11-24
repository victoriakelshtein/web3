class Player {
    constructor(game) {
        this.game = game;
        this.width = 40;
        this.height = 60;
        this.reset();
        
        // Физика
        this.gravity = 1500;
        this.jumpForce = -600;
        this.speed = 400;
        
        // Состояние
        this.onGround = false;
        this.facingRight = true;
        this.isJumping = false;
    }
    
    reset() {
        this.x = 50;
        this.y = 200;
        this.velocityX = 0;
        this.velocityY = 0;
        this.onGround = false;
        this.isJumping = false;
    }
    
    update(deltaTime, platforms) {

        // Блокируем управление во время перехода между уровнями
        if (this.game.isTransitioning) {
            this.velocityX = 0;
            this.velocityY = 0;
            return;
        }
        // Обработка ввода
        this.handleInput();
        
        // Применение гравитации
        if (!this.onGround) {
            this.velocityY += this.gravity * deltaTime;
        }
        
        // Обновление позиции
        this.x += this.velocityX * deltaTime;
        this.y += this.velocityY * deltaTime;
        
        // Проверка коллизий с платформами
        this.handleCollisions(platforms);
        
        // Ограничение движения в пределах canvas
        if (this.x < 0) {
            this.x = 0;
            this.velocityX = 0;
        }
        if (this.x + this.width > this.game.width) {
            this.x = this.game.width - this.width;
            this.velocityX = 0;
        }
        
        // Анимация приземления
        if (this.onGround && this.isJumping) {
            this.isJumping = false;
        }
    }
    
    handleInput() {
        // Блокируем ввод во время перехода
        if (this.game.isTransitioning) {
            this.velocityX = 0;
            return;
        }
        
        this.velocityX = 0;
        
        if (this.game.input.keys['ArrowLeft'] || this.game.input.keys['KeyA']) {
            this.velocityX = -this.speed;
            this.facingRight = false;
        }
        
        if (this.game.input.keys['ArrowRight'] || this.game.input.keys['KeyD']) {
            this.velocityX = this.speed;
            this.facingRight = true;
        }
        
        if ((this.game.input.keys['Space'] || this.game.input.keys['KeyW'] || this.game.input.keys['ArrowUp']) && this.onGround) {
            this.velocityY = this.jumpForce;
            this.onGround = false;
            this.isJumping = true;
        }
    }
    
    handleCollisions(platforms) {
        this.onGround = false;
        
        for (const platform of platforms) {
            if (Collision.checkRectRect(this, platform)) {
                // Определение стороны столкновения
                const dx = (this.x + this.width / 2) - (platform.x + platform.width / 2);
                const dy = (this.y + this.height / 2) - (platform.y + platform.height / 2);
                
                const width = (this.width + platform.width) / 2;
                const height = (this.height + platform.height) / 2;
                
                const crossX = Math.abs(dx) - width;
                const crossY = Math.abs(dy) - height;
                
                if (crossX < crossY) {
                    if (crossX < 0 && crossY < 0) {
                        if (Math.abs(crossX) < Math.abs(crossY)) {
                            if (dx > 0) {
                                // Столкновение справа
                                this.x = platform.x + platform.width;
                            } else {
                                // Столкновение слева
                                this.x = platform.x - this.width;
                            }
                        } else {
                            if (dy > 0) {
                                // Столкновение снизу
                                this.y = platform.y + platform.height;
                                this.velocityY = 0;
                            } else {
                                // Столкновение сверху (стоит на платформе)
                                this.y = platform.y - this.height;
                                this.velocityY = 0;
                                this.onGround = true;
                                this.isJumping = false;
                            }
                        }
                    }
                }
            }
        }
    }
    
    draw(ctx) {
        // Тело игрока
        ctx.fillStyle = this.isJumping ? '#C0392B' : '#E74C3C';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Голова
        ctx.fillStyle = '#ECF0F1';
        ctx.fillRect(this.x + 5, this.y + 5, this.width - 10, 20);
        
        // Глаза
        ctx.fillStyle = '#2C3E50';
        const eyeX = this.facingRight ? this.x + 25 : this.x + 10;
        ctx.fillRect(eyeX, this.y + 10, 5, 5);
        
        // Ноги при движении
        ctx.fillStyle = '#C0392B';
        if (this.velocityX !== 0 && this.onGround) {
            const legOffset = Math.sin(Date.now() * 0.01) * 5;
            ctx.fillRect(this.x + 5, this.y + this.height - 10, 10, 10 + legOffset);
            ctx.fillRect(this.x + this.width - 15, this.y + this.height - 10, 10, 10 - legOffset);
        } else {
            ctx.fillRect(this.x + 5, this.y + this.height - 10, 10, 10);
            ctx.fillRect(this.x + this.width - 15, this.y + this.height - 10, 10, 10);
        }
        
        // Эффект прыжка
        if (this.isJumping) {
            ctx.strokeStyle = '#F39C12';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height + 10, 15, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }
}