
import Game from "./game.js";


function draw(game){
    renderGrid(game);
    renderUI(game);

}

function renderGrid(game){
    let root =  $('#root');
    let gameSize = Math.sqrt(game.getGameState().board.length);
    let count = 0;
    let renderRow = 1000;
    for (let row = 0; row < gameSize; row++){
    root.append($(
        "<div id='"+renderRow+"' class='columns'></div>"
    ));
        for (let col= 0; col< gameSize; col++){
            let num = game.getGameState().board[count];
            $('#'+renderRow).append($(
                "<div id='"+count+"' class='column num '> <h1 class= colorTile id='tile"+num+"'>"+num+"</h1> </div>"
                
            ));
            count++;
        }
        renderRow = renderRow + 1000;
    }

    

}

function renderUI(game){
    $('#score').append("<p class='title'>"+game.getGameState().score+"</p>");

}

function update(game){
    for(let i = 0; i < game.getGameState().board.length; i++){
        let num = game.getGameState().board[i];
        updateCell(game, i);
    }
    updateUI(game);

}

function updateGameState(game){
    if(game.getGameState().won){
        $('#winOrLose').children().replaceWith("<h1 class='subtitle'> You Win! </h1>");
    }

    if(game.getGameState().over){
        $('#winOrLose').children().replaceWith("<h1 class='subtitle'> You Lose! </h1>");
    }

    if(!(game.getGameState().won)){
        $('#winOrLose').children().replaceWith("<div></div>");
    }

}

function updateUI(game){
    $('#score').children().replaceWith("<p class='title'>"+game.getGameState().score+"</p>");
    updateGameState(game);
}

function updateCell(game, index){
    $('#'+index).children().replaceWith("<h1 class= colorTile id='tile"+game.gameState.board[index]+"'>"+game.gameState.board[index]+"</h1>");
}

$(document).ready(function(){
    let game = new Game(4);
    draw(game);

    $('#newGame').on('click',function(){
        game.setupNewGame();
        update(game);
    })

    $(document).keydown(function(e){
        switch (e.keyCode) {
            case 37: //left
                game.move("left");
                update(game);
                break;
            case 39: //right
                game.move("right");
                update(game);
                break;
            case 38: //up
                game.move("up");
                update(game);
                break;
            case 40: //down
                game.move("down");
                update(game);
                break;
        }
    });

    
})


