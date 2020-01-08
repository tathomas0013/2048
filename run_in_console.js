import keypress from 'keypress';
import Game from "./engine/game";

keypress(process.stdin);


/**
 * The code in this file is used to run your game in the console. Use it
 * to help develop your game engine.
 *
 */

//let game = new Game(4);
let game = new Game(4);
//game.gameState.board = [2,2,16,2,32,4,32,8,2,64,4,2,2,4,8,18];
game.gameState.board = [0,0,2,2,0,1024,1024,2,0,0,0,4,16,0,8,8];
//game.gameState.board = [2,32,2,64,8,256,128,8,4,0,32,256,4,256,4,8];
console.log(game.toString());


game.onMove(gameState => {
    console.log(game.gameState);
});


game.onWin(gameState => {
    console.log('You won with a gameState of...', gameState)
});

game.onLose(gameState => {
    console.log('You lost! :(', gameState)
    console.log(`Your score was ${gameState.score}`);
});


process.stdin.on('keypress', function (ch, key) {
    switch (key.name) {
        case 'right':
            game.move('right');
            break;
        case 'left':
            game.move('left');

            break;
        case 'down':
            game.move('down');

            break;
        case 'up':
            game.move('up');
            break;
        
    }
    if (key && key.ctrl && key.name == 'c') {
        process.stdin.pause();
    }
});


process.stdin.setRawMode(true);
process.stdin.resume();

