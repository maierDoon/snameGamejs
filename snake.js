(function () {
    "use strict";
    
    var canvas = document.getElementById('theCanvas'),
        context = canvas.getContext('2d'),
        face = new Image(),
        apple = new Image(),
        snakeSize = 64,
        snake = [{x: 0, y: 0}],
        lastX = 0,
        lastY = 0,
        appleX,
        appleY,
        LEFT = 37,
        UP = 38,
        RIGHT = 39,
        DOWN = 40,
        direction = RIGHT,
        crash = document.getElementById('ding'),
        speed = 500;
 
    function resizeCanvas() {
        var w = window.innerWidth - 10,
            h = window.innerHeight - 10;
            
        w = w - (w % snakeSize);
        h = h - (h % snakeSize);
        
        canvas.width =  w;
        canvas.height = h;
    }
    resizeCanvas();
    
    window.addEventListener('resize', resizeCanvas);
    
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
    function placeApple() {
        var valid,
            i;
        do {
            valid = true;
            
            appleX = getRandomNumber(0, canvas.width - 1);
            appleY = getRandomNumber(0, canvas.height - 1);

            appleX = appleX - (appleX % snakeSize);
            appleY = appleY - (appleY % snakeSize);
            
            for (i = 0; i < snake.length; i += 1) {
                if (appleX === snake[i].x && appleY === snake[i].y) {
                    valid = false;
                    break;
                }
            }
            
            context.drawImage(apple, appleX, appleY, snakeSize, snakeSize);
        } while (!valid);
    }
    
    function render() {
        context.clearRect(lastX, lastY, snakeSize, snakeSize);
        
        context.drawImage(face, snake[0].x, snake[0].y, snakeSize, snakeSize);
        
        if (snake.length > 1) {
            context.fillRect(snake[1].x, snake[1].y, snakeSize, snakeSize);
        }
        
        lastX = snake[snake.length - 1].x;
        lastY = snake[snake.length - 1].y;
    }
    
    function gameLoop() {
        var timeout = setTimeout(function () {
            var x = 0,
                y = 0,
                head,
                tail,
                i;
                                   
            switch (direction) {
            case LEFT:
                x = -snakeSize;
                break;
            case UP:
                y = -snakeSize;
                break;
            case RIGHT:
                x = snakeSize;
                break;
            case DOWN:
                y = snakeSize;
                break;
            }
            
            if (snake[0].x + x < 0 || snake[0].x + x >= canvas.width
                    || snake[0].y + y < 0 || snake[0].y + y >= canvas.height) {
                crash.play();
                return;
            }
            
            for (i = 1; i < snake.length; i += 1) {
                if (snake[0].x + x === snake[i].x && snake[0].y + y === snake[i].y) {
                    crash.play();
                    return;
                }
            }
            
            if (snake[0].x + x === appleX && snake[0].y + y === appleY) {
                snake.unshift({x: appleX, y: appleY});
                speed *= 0.85;
                placeApple();
            } else {
                tail = snake.pop();
                head = snake[0] || tail;
                tail.x = head.x + x;
                tail.y = head.y + y;
                snake.unshift(tail);
            }
            render();
            gameLoop();
        }, speed);
    }
    
    document.body.addEventListener('keyup', function (event) {
        switch (event.which) {
        case LEFT:
        case UP:
        case RIGHT:
        case DOWN:
            direction = event.which;
            break;
        }
    });
    
    face.src = 'snake-head.png';
    
    face.onload = function () {
        gameLoop();
    };
    
    apple.src = 'apple.jpg';
    
    apple.onload = function () {
        placeApple();
    };
}());