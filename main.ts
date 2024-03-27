// ················································································
// SNAKE
// ················································································

// --------------------------------------------------------------------------------
// Constantes
// --------------------------------------------------------------------------------
const TAMANO = 8;                       // Tamaño de la cuadrícula (px)
const ANCHO_PIXELES = screen.width;     // ancho de pantalla en pixeles
const ALTO_PIXELES = screen.height;     // alto de pantalla en pixeles
const ANCHO = ANCHO_PIXELES / TAMANO;   // ancho en unidades del juego
const ALTO = ALTO_PIXELES / TAMANO;     // alto en unidades del juego
const VELOCIDAD = 0.15;                 // Velocidad inicial (menor => más rápido)

const COLOR_BORDE = 14;
const COLOR_SNAKE = 1;
const COLOR_FOOD = 2;
const COLOR_FONDO = 0;

// --------------------------------------------------------------------------------
// Variables
// --------------------------------------------------------------------------------
let dx = 1; // Dirección en X
let dy = 0; // Dirección en Y
let time = 0; // Temporizador para mover la serpiente
let foodX:int8; // Posición X de la comida
let foodY:int8; // Posición Y de la comida

// snake:   es un array de posiciones (x,y). 
//          Inicialmente tiene solo 1 segmento (una fila) en la posición (4,3)
//          Por cada comida que coma, crece un segmento (1 fila)
let snake = [{ x: 4, y: 3 }];


// Función para generar una nueva comida
function nuevaComida() {
    do {
        // calcula una posicion aleatoria en X entre (1 y ancho-2)
        // porque los valores de X posibles están entre (0, ancho-1)
        // pero 1 es el borde izquierdo y ancho-1 el borde derecho
        foodX = randint(1, ANCHO - 2);
        // calcula una posicion aleatoria en Y entre (1 y alto-2)
        foodY = randint(1, ALTO - 2);
    } while (estaEnSnake(foodX, foodY));
    // el bucle se repite si la posicion de la comida coincide con algun segmento de la snake
}

// Función para comprobar si la posición (x,y) enviada pertenece a la snake
function estaEnSnake(x: number, y: number) {
    // bucle que recorre todo el snake para comprobar si el punto (x,y) coincide con
    // algun punto de la snake
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x == x && snake[i].y == y)
            return true; // esta en snake y sale de la funcion (ya no hace falta seguir)
    }
    return false; // no lo encontró en el bucle => no esta en la snake
}

// Función para comprobar si la posicion (x,y) enviada pertenece al borde
function esBorde(x: number, y: number) {
    return x == 0 || y == 0 || x == ANCHO - 1 || y == ALTO - 1;
}

function finJuego(){
    if (info.score() >= info.highScore())
        game.over(true, effects.confetti);
    else
        game.over(false, effects.smiles);
}

// Función para dibujar toda la pantalla del juego
function show() {
    // Esta funcion se llama en cada tik del juego
    // se imprime de nuevo toda la pantalla: borde, snake y comida (estas dos ultimas en la
    // posición que corresponda)
    for (let y = 0; y < ALTO; ++y) {
        // fila Y
        for (let x = 0; x < ANCHO; ++x) {
            // columna X
            // Ahora se pinta cada cuadrado de la pantalla del color que le corresponde.
            // Por defecto es FONDO, pero puede ser BORDER, SNAKE o COMIDA
            let color = COLOR_FONDO;
            if (esBorde(x, y)) color = COLOR_BORDE; // Borde
            if (estaEnSnake(x, y)) color = COLOR_SNAKE; // Serpiente
            if (x == foodX && y == foodY) color = COLOR_FOOD; // Comida
            // Dibuja un cuadrado de lado TAMANO del color que corresponda 
            // (fondo, borde, snake o food)
            screen.fillRect(x * TAMANO, y * TAMANO, TAMANO - 1, TAMANO - 1, color);
        }
    }
}

// Bucle principal del juego
game.onPaint(function () {
    // Control de la dirección
    if (controller.dx(100)) { // si horizontal
        dx = Math.sign(controller.dx(100));
        dy = 0; // para evitar movimientos diagonales. Es decir, si se mueve en X => no se mueve en Y
    } 
    else if (controller.dy(100)) { // si vertical
        dx = 0; // no se mueve en horizontal
        dy = Math.sign(controller.dy(100));
    }

    // Actualizar el temporizador
    time += game.eventContext().deltaTime;

    // Mover la serpiente
    if (time > VELOCIDAD) {
        let x = snake[0].x;
        let y = snake[0].y;
        x += dx;
        y += dy;

        // Comprobar si la serpiente se choca con el borde o consigo misma => GAME OVER
        if (esBorde(x, y) || estaEnSnake(x, y)) 
            finJuego();

        // Añadir la nueva posición a la cabeza de la serpiente
        // Si no se pasa por una comida se elimina el ultimo segmento, asi parece que avanza
        snake.unshift({x, y});

        // Si la serpiente come la comida, crecer y generar una nueva
        if (x == foodX && y == foodY) {
            nuevaComida();
            info.changeScoreBy(1); // se incrementa la puntuación
            // no se elimina el ultimo segmento
        } else {
            // Elimina la última posición de la cola de la serpiente
            snake.pop();
        }

        // Reiniciar el temporizador
        time = 0;
    }
    // Mostrar el juego
    show();
});

// Inicializar el juego
nuevaComida();