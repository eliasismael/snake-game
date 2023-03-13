#Snake Game
This is a basic implementation of the classic Snake game using HTML5 Canvas and JavaScript.

#How to play
Load the game on your browser.
Press the space bar to start the game. The snake will start moving to the right.
Use the arrow keys to change the direction of the snake.
The goal of the game is to eat the apple that appears on the screen without colliding with the walls or the snake's body.
Each time the snake eats the apple, it grows by one block and the player earns 10 points.
If the snake collides with the walls or its own body, the game is over.
If the player occupies all possible positions on the canvas, the game is won.
The game can be paused at any time by pressing the space bar.
#Code overview
The game is built using HTML5 Canvas and JavaScript. The game board is represented by a 300x300 pixels canvas element. The snake and apple are represented by blocks of 15x15 pixels.

The game logic is divided into functions that handle different aspects of the game, such as creating the canvas and score display, handling user input, moving the snake, and detecting collisions.

The game loop is implemented using setInterval() and runs at a speed of 15 frames per second. The direction of the snake is updated based on user input, and the position of the snake is updated based on the current direction.

The game keeps track of the score and displays it on the screen. The game can be paused by pressing the space bar, and the player can resume the game by pressing the space bar again. If the game is won or lost, an alert is displayed, and the game is stopped.

The code is well commented, making it easy to understand and modify.
