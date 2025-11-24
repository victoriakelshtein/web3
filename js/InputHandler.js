class InputHandler {
    constructor() {
        this.keys = {};
        
        // Обработчики событий клавиатуры
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
    }
}