// Главный файл для инициализации игры
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const restartBtn = document.getElementById('restartBtn');
    const gameMessage = document.getElementById('gameMessage');
    
    // Создание экземпляра игры
    const game = new Game(canvas, ctx);
    
    // Обработчики кнопок
    startBtn.addEventListener('click', () => {
        if (game.gameOver) {
            game.restart();
        } else {
            game.start();
        }
        gameMessage.classList.add('hidden');
    });
    
    pauseBtn.addEventListener('click', () => {
        game.togglePause();
    });
    
    restartBtn.addEventListener('click', () => {
        game.restart();
        gameMessage.classList.add('hidden');
    });
    
    // Обработка клавиши ESC для паузы
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape') {
            game.togglePause();
        }
    });
    
    // Показать сообщение при загрузке
    gameMessage.textContent = 'Нажмите "Старт" чтобы начать!';
    gameMessage.classList.remove('hidden');
});