class Game {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
        
        // Игровые объекты
        this.player = new Player(this);
        this.platforms = [];
        this.coins = [];
        this.enemies = [];
        this.movingPlatforms = [];
        this.input = new InputHandler();
        
        // Игровое состояние
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.gameOver = false;
        this.paused = false;
        this.levelComplete = false;
        this.totalCoins = 0;
        this.collectedCoins = 0;
        this.isTransitioning = false; // Флаг перехода между уровнями
        
        // Создание уровня
        this.createLevel();
        
        // Игровой цикл
        this.lastTime = 0;
        this.accumulator = 0;
        this.timeStep = 1000 / 60; // 60 FPS
        
        this.updateUI();
    }
    
    createLevel() {
        // Очистка предыдущих объектов
        this.platforms = [];
        this.coins = [];
        this.enemies = [];
        this.movingPlatforms = [];
        this.collectedCoins = 0;
        this.isTransitioning = false;
        
        // Создание платформ
        // Пол
        this.platforms.push(new Platform(0, this.height - 40, this.width, 40, '#7D3C98'));
        
        // Платформы для прыжков
        const platformConfigs = this.getPlatformConfigs();
        
        platformConfigs.forEach(config => {
            this.platforms.push(new Platform(config.x, config.y, config.width, 20, config.color));
        });
        
        // Опасные платформы (на которые нельзя наступать)
        this.createDangerousPlatforms();
        
        // Двигающиеся платформы
        this.createMovingPlatforms();
        
        // Враги
        this.createEnemies();
        
        // Создание монет
        this.totalCoins = 5 + this.level * 2;
        const coinPositions = this.generateCoinPositions();
        
        coinPositions.forEach(pos => {
            this.coins.push(new Coin(pos.x, pos.y));
        });
        
        // Сброс позиции игрока
        this.player.reset();
        this.levelComplete = false;
    }
    
    getPlatformConfigs() {
        // Базовые платформы
        const basePlatforms = [
            { x: 100, y: 400, width: 200, color: '#2ECC71' },
            { x: 400, y: 350, width: 150, color: '#2ECC71' },
            { x: 200, y: 300, width: 200, color: '#2ECC71' },
            { x: 500, y: 250, width: 150, color: '#2ECC71' },
            { x: 100, y: 200, width: 200, color: '#2ECC71' },
            { x: 400, y: 150, width: 150, color: '#2ECC71' }
        ];
        
        if (this.level === 1) return basePlatforms;
        
        // Дополнительные платформы для сложных уровней
        const additionalPlatforms = [
            { x: 600, y: 100, width: 100, color: '#2ECC71' },
            { x: 50, y: 250, width: 80, color: '#2ECC71' },
            { x: 300, y: 100, width: 120, color: '#2ECC71' },
            { x: 550, y: 320, width: 90, color: '#2ECC71' }
        ];
        
        return [...basePlatforms, ...additionalPlatforms.slice(0, this.level - 1)];
    }
    
    createDangerousPlatforms() {
        if (this.level >= 2) {
            // Опасные платформы (шипы)
            const dangerousPlatforms = [
                { x: 350, y: 450, width: 100, color: '#E74C3C' },
                { x: 600, y: 300, width: 80, color: '#E74C3C' }
            ];
            
            dangerousPlatforms.forEach(platform => {
                this.platforms.push(new Platform(platform.x, platform.y, platform.width, 20, platform.color));
            });
            
            // Больше опасных платформ на высоких уровнях
            if (this.level >= 4) {
                this.platforms.push(new Platform(200, 180, 120, 20, '#E74C3C'));
            }
            if (this.level >= 6) {
                this.platforms.push(new Platform(450, 220, 90, 20, '#E74C3C'));
            }
        }
    }
    
    createMovingPlatforms() {
        if (this.level >= 3) {
            // Горизонтальные двигающиеся платформы
            this.movingPlatforms.push(new MovingPlatform(300, 380, 120, 15, 150, 0, '#3498DB'));
            this.movingPlatforms.push(new MovingPlatform(100, 280, 100, 15, 120, 0, '#3498DB'));
            
            // Вертикальные двигающиеся платформы на высоких уровнях
            if (this.level >= 5) {
                this.movingPlatforms.push(new MovingPlatform(500, 200, 80, 15, 0, 80, '#9B59B6'));
                this.movingPlatforms.push(new MovingPlatform(200, 120, 100, 15, 0, 60, '#9B59B6'));
            }
            
            // Сложные диагональные платформы на очень высоких уровнях
            if (this.level >= 7) {
                this.movingPlatforms.push(new MovingPlatform(400, 320, 90, 15, 100, 50, '#E67E22'));
            }
        }
    }
    
    createEnemies() {
        if (this.level >= 4) {
            // Простые враги
            for (let i = 0; i < Math.min(this.level - 3, 3); i++) {
                const x = 200 + i * 150;
                const y = 300 - i * 20;
                this.enemies.push(new Enemy(x, y, 35, 35));
            }
            
            // Летающие враги на высоких уровнях
            if (this.level >= 6) {
                this.enemies.push(new FlyingEnemy(400, 100, 30, 30));
                this.enemies.push(new FlyingEnemy(600, 150, 30, 30));
            }
            
            // Быстрые враги на очень высоких уровнях
            if (this.level >= 8) {
                this.enemies.push(new FastEnemy(100, 350, 25, 25));
            }
        }
    }
    
    generateCoinPositions() {
        const positions = [];
        const existingPositions = [];
        
        for (let i = 0; i < this.totalCoins; i++) {
            let x, y, validPosition;
            let attempts = 0;
            
            do {
                x = 60 + Math.random() * (this.width - 120);
                y = 100 + Math.random() * (this.height - 200);
                validPosition = true;
                
                // Проверяем, чтобы монета не пересекалась с платформами
                for (const platform of [...this.platforms, ...this.movingPlatforms]) {
                    const coinRect = {x: x - 15, y: y - 15, width: 30, height: 30};
                    if (Collision.checkRectRect(coinRect, platform)) {
                        validPosition = false;
                        break;
                    }
                }
                
                // Проверяем, чтобы монеты не были слишком близко друг к другу
                for (const pos of existingPositions) {
                    const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
                    if (distance < 40) {
                        validPosition = false;
                        break;
                    }
                }
                
                attempts++;
                if (attempts > 50) {
                    break;
                }
            } while (!validPosition);
            
            if (validPosition || attempts > 50) {
                positions.push({x, y});
                existingPositions.push({x, y});
            }
        }
        
        return positions;
    }
    
    start() {
        if (!this.gameOver && !this.paused && !this.isTransitioning) {
            this.lastTime = performance.now();
            this.gameLoop();
        }
    }
    
    togglePause() {
        if (this.isTransitioning) return; // Не позволяем паузу во время перехода
        
        this.paused = !this.paused;
        if (!this.paused && !this.gameOver && !this.levelComplete) {
            this.lastTime = performance.now();
            this.gameLoop();
        }
    }
    
    restart() {
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.gameOver = false;
        this.paused = false;
        this.levelComplete = false;
        this.isTransitioning = false;
        this.createLevel();
        this.updateUI();
    }
    
    gameLoop(timestamp = 0) {
        if (this.gameOver || this.paused || this.isTransitioning) return;
        
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        this.accumulator += deltaTime;
        
        while (this.accumulator >= this.timeStep) {
            this.update(this.timeStep / 1000);
            this.accumulator -= this.timeStep;
        }
        
        this.render();
        
        if (!this.gameOver && !this.levelComplete && !this.isTransitioning) {
            requestAnimationFrame((time) => this.gameLoop(time));
        }
    }
    
    update(deltaTime) {
        // Обновление игрока
        this.player.update(deltaTime, [...this.platforms, ...this.movingPlatforms]);
        
        // Обновление двигающихся платформ
        this.movingPlatforms.forEach(platform => {
            platform.update(deltaTime);
        });
        
        // Обновление врагов
        this.enemies.forEach(enemy => {
            enemy.update(deltaTime);
            
            // Проверка коллизий с врагами
            if (Collision.checkRectRect(this.player, enemy)) {
                this.loseLife("Столкновение с врагом!");
                return; // Прерываем цикл после потери жизни
            }
        });
        
        // Проверка коллизий с монетами
        for (let i = this.coins.length - 1; i >= 0; i--) {
            if (Collision.checkPlayerCoin(this.player, this.coins[i])) {
                this.coins.splice(i, 1);
                this.collectedCoins++;
                this.score += 10;
                this.updateUI();
                
                // Проверка завершения уровня
                if (this.collectedCoins >= this.totalCoins) {
                    this.levelComplete = true;
                    this.isTransitioning = true; // Блокируем управление во время перехода
                    setTimeout(() => this.completeLevel(), 1000);
                }
            }
        }
        
        // Проверка касания опасных платформ - ПРОВЕРЯЕМ СРАЗУ ПРИ КАСАНИИ
        for (const platform of this.platforms) {
            if (platform.color === '#E74C3C' && Collision.checkRectRect(this.player, platform)) {
                this.loseLife("Опасная платформа!");
                break; // Прерываем после первой опасной платформы
            }
        }
        
        // Проверка падения игрока
        if (this.player.y > this.height) {
            this.loseLife("Падение с платформы!");
        }
        
        // Бонус за нахождение наверху
        if (this.player.y < 30) {
            this.score += 2;
            this.updateUI();
        }
    }
    
    loseLife(reason = "") {
        if (this.isTransitioning) return; // Не теряем жизни во время перехода
        
        this.lives--;
        this.updateUI();
        
        if (this.lives <= 0) {
            this.gameOver = true;
            this.showMessage(`Игра окончена! ${reason} Ваш счет: ${this.score}`);
        } else {
            // Перезапуск уровня при потере жизни
            this.player.reset();
            this.showMessage(`${reason} Потеряна жизнь! Осталось: ${this.lives}`, 1500);
        }
    }
    
    completeLevel() {
        const levelBonus = 100 * this.level;
        this.score += levelBonus;
        this.level++;
        
        this.updateUI();
        this.showMessage(`Уровень ${this.level - 1} пройден! Бонус: +${levelBonus} очков`);
        
        // Переход к следующему уровню через 2 секунды
        setTimeout(() => {
            this.createLevel();
            this.levelComplete = false;
            this.isTransitioning = false; // Разблокируем управление
            this.lastTime = performance.now();
            this.gameLoop();
        }, 2000);
    }
    
    render() {
        // Очистка canvas
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Отрисовка платформ
        this.platforms.forEach(platform => platform.draw(this.ctx));
        
        // Отрисовка двигающихся платформ
        this.movingPlatforms.forEach(platform => platform.draw(this.ctx));
        
        // Отрисовка врагов
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
        
        // Отрисовка монет
        this.coins.forEach(coin => coin.draw(this.ctx));
        
        // Отрисовка игрока
        this.player.draw(this.ctx);
        
        // Отрисовка UI поверх игры
        this.drawUI();
        
        // Сообщение о завершении уровня
        if (this.levelComplete) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(0, 0, this.width, this.height);
            
            this.ctx.fillStyle = '#4CAF50';
            this.ctx.font = 'bold 36px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('УРОВЕНЬ ПРОЙДЕН!', this.width / 2, this.height / 2 - 30);
            this.ctx.font = '24px Arial';
            this.ctx.fillText(`Бонус: +${100 * (this.level - 1)} очков`, this.width / 2, this.height / 2 + 20);
            this.ctx.textAlign = 'left';
        }
    }
    
    drawUI() {
        // Панель статистики
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(10, 10, 220, 110);
        
        this.ctx.fillStyle = 'white';
        this.ctx.font = '16px Arial';
        this.ctx.fillText(`Очки: ${this.score}`, 20, 30);
        this.ctx.fillText(`Уровень: ${this.level}`, 20, 50);
        this.ctx.fillText(`Жизни: ${this.lives}`, 20, 70);
        this.ctx.fillText(`Монеты: ${this.collectedCoins}/${this.totalCoins}`, 20, 90);
        
        // Индикатор сложности
        const difficulty = Math.min(this.level, 10);
        this.ctx.fillText(`Сложность: ${difficulty}/10`, 20, 110);
        
        // Прогресс-бар
        const progressWidth = 250;
        const progressHeight = 20;
        const progressX = this.width - progressWidth - 20;
        const progressY = 15;
        
        // Фон прогресс-бара
        this.ctx.fillStyle = '#34495E';
        this.ctx.fillRect(progressX, progressY, progressWidth, progressHeight);
        
        // Заполнение прогресс-бара
        const progress = this.totalCoins > 0 ? this.collectedCoins / this.totalCoins : 0;
        this.ctx.fillStyle = progress === 1 ? '#2ECC71' : '#F1C40F';
        this.ctx.fillRect(progressX, progressY, progressWidth * progress, progressHeight);
        
        // Рамка прогресс-бара
        this.ctx.strokeStyle = '#2C3E50';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(progressX, progressY, progressWidth, progressHeight);
        
        // Текст прогресс-бара
        this.ctx.fillStyle = 'white';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            `Прогресс: ${this.collectedCoins}/${this.totalCoins} (${Math.round(progress * 100)}%)`, 
            progressX + progressWidth / 2, 
            progressY + progressHeight / 2 + 5
        );
        this.ctx.textAlign = 'left';
        
        if (this.paused) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
            this.ctx.fillRect(0, 0, this.width, this.height);
            
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('ПАУЗА', this.width / 2, this.height / 2);
            this.ctx.textAlign = 'left';
        }
        
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
            this.ctx.fillRect(0, 0, this.width, this.height);
            
            this.ctx.fillStyle = '#E74C3C';
            this.ctx.font = 'bold 48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('ИГРА ОКОНЧЕНА', this.width / 2, this.height / 2 - 50);
            
            this.ctx.fillStyle = 'white';
            this.ctx.font = '24px Arial';
            this.ctx.fillText(`Ваш счет: ${this.score}`, this.width / 2, this.height / 2);
            this.ctx.fillText(`Достигнут уровень: ${this.level}`, this.width / 2, this.height / 2 + 40);
            this.ctx.textAlign = 'left';
        }
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
        document.getElementById('lives').textContent = this.lives;
    }
    
    showMessage(message, duration = 3000) {
        const gameMessage = document.getElementById('gameMessage');
        gameMessage.textContent = message;
        gameMessage.classList.remove('hidden');
        
        if (duration > 0) {
            setTimeout(() => {
                gameMessage.classList.add('hidden');
            }, duration);
        }
    }
}