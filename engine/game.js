

//Model
export default class Game{
    constructor(size){
        this.gameState = {
            board: new Array(),
            score: 0,
            won: false,
            over: false,
        } 
        for (let i = 0; i < size *size; i++){
            this.gameState.board[i]=0;
        }
        let callbacks = new Array();
        this.placeNewTile();
        this.placeNewTile();
        this.onMoveArr = [];
        this.onWinArr = [];
        this.onLoseArr =[];
        
    }

    setupNewGame(){
        let size = Math.sqrt(this.gameState.board.length);
        for (let i = 0; i < size *size; i++){
            this.gameState.board[i]=0;
        }
        this.placeNewTile();
        this.placeNewTile();
        this.gameState.score = 0;
        this.gameState.won = false;
        this.gameState.over = false;
    }


    getGameState(){
        return this.gameState;
    }

    onMove(callback){
        this.onMoveArr.push(callback);
    }

    onWin(callback){
        this.onWinArr.push(callback);

    }

    onLose(callback){
        this.onLoseArr.push(callback);
        
    }

    loadGame(state){
        this.gameState=state;
    }

    placeNewTile(){
        let chance = Math.random();
        let placed = 0;
        while (placed != 1){
            //let spot =  chance > .5 ? Math.ceil(Math.random(1)*this.gameState.board.length): Math.floor(Math.random(1)*this.gameState.board.length)
            // Math.random() returns [0, 1)
            let spot = Math.floor(Math.random() * this.gameState.board.length);
            if(this.gameState.board[spot] === 0){
                this.gameState.board[spot] = chance > .1 ? 2: 4
                placed = 1;
            }
        }

    }


    move(direction){
        let past = JSON.parse(JSON.stringify(this.gameState.board));
        let size = Math.sqrt(this.gameState.board.length);




        if (direction === "down" || direction === "up"){
            let queue = new Array();
            for (let col = 0; col < size; col++){
                for (let row = col; row <= col + (size *(size-1)); row = row +size){ 
                    let current = this.gameState.board[row];
                    if (current != 0){
                            queue.push(current);
                            this.gameState.board[row] = 0; 
                    }
                }

                if(direction === "down"){ //Swiped Down
                    for (let back = col + (size *(size-1)); back >= col; back = back - size){
                        let temp = queue.pop();
                        if (temp === undefined){
                            this.gameState.board[back] = 0;
                        } else if(temp === queue[queue.length-1]) {
                            queue.pop();
                            this.gameState.board[back]=temp*2;
                            this.gameState.score= this.gameState.score + (temp*2);
                        }else{
                            this.gameState.board[back] = temp;
                        }
                    }

                }else { //Swiped Up 
                    queue.reverse();
                    for (let back = col; back < this.gameState.board.length; back = back + size){
                        let temp = queue.pop();
                        if (temp === undefined){
                            this.gameState.board[back] = 0;
                        } else if(temp === queue[queue.length-1]) {
                            queue.pop();
                            this.gameState.board[back]=temp*2;
                            this.gameState.score= this.gameState.score + (temp*2);
                        }else{
                            this.gameState.board[back] = temp;
                        }
                    }
                }
            }

        } else{ //Left and Right case
            let queue = new Array();
            for (let row = 0; row < this.gameState.board.length; row = row + size){
                for (let cell = row; cell < row + size; cell++){
                    let current = this.gameState.board[cell];
                    if (current != 0){
                        queue.push(current);
                        this.gameState.board[row] = 0;          
                    }
                }

                if (direction === "left"){ // shift left
                    queue.reverse();
                    for (let back= row; back < row + size; back++){
                        let temp = queue.pop();
                        if (temp === undefined){
                            this.gameState.board[back] = 0;
                        } else if(temp === queue[queue.length-1]) {
                            queue.pop();
                            this.gameState.board[back]=temp*2;
                            this.gameState.score= this.gameState.score + (temp*2);
                        }else{
                            this.gameState.board[back] = temp;
                        }

                    }
                } else { // shift right
                    for(let back = row + (size -1); back >= row; back-- ){
                        let temp = queue.pop();
                        if (temp === undefined){
                            this.gameState.board[back] = 0;
                        } else if(temp === queue[queue.length-1]) {
                            queue.pop();
                            this.gameState.board[back]=temp*2;
                            this.gameState.score= this.gameState.score + (temp*2);
                        }else{
                            this.gameState.board[back] = temp;
                        }
                    }
                    
                }
            }

            // end of move logic, call all the observers/callback responding to a move event
            // check if a successful move has been made

            
            
        }

        this.onMoveArr.forEach(callback =>{
            callback(this.getGameState());
        });


        if (JSON.stringify(past)===JSON.stringify(this.gameState.board)){
        } else {
        this.placeNewTile();
        }

        this.checkWin();
        this.checkLose();
        


    }

    checkWin(){
        let arr2084 = this.gameState.board.filter(function(item){
        return item == 2048;
        });

        if (arr2084.length != 0){
            this.gameState.won = true;
            this.onWinArr.forEach(callback =>{
                callback(this.getGameState());
            })
        }
    }

    checkLose(){
        let past = JSON.parse(JSON.stringify(this.gameState.board));
        let right = this.moveAvalible(past,"right");
        let left = this.moveAvalible(past,"left");
        let up = this.moveAvalible(past, "up");
        let down = this.moveAvalible(past, "down");

        if (right && left && up && down){
            this.gameState.over= true; 
            this.onLoseArr.forEach(callback =>{
                callback(this.getGameState());
            })
        }

    }

    moveAvalible(pureSad,direction){
        let size = Math.sqrt(this.gameState.board.length);
        let newBoard = JSON.parse(JSON.stringify(pureSad));


        if (direction === "down" || direction === "up"){
            let queue = new Array();
            for (let col = 0; col < size; col++){
                for (let row = col; row <= col + (size *(size-1)); row = row +size){ 
                    let current = newBoard[row];
                    if (current != 0){
                            queue.push(current);
                            newBoard[row] = 0; 
                    }
                }

                if(direction === "down"){ //Swiped Down
                    for (let back = col + (size *(size-1)); back >= col; back = back - size){
                        let temp = queue.pop();
                        if (temp === undefined){
                            newBoard[back] = 0;
                        } else if(temp === queue[queue.length-1]) {
                            queue.pop();
                            newBoard[back]=temp*2;
                        }else{
                            newBoard[back] = temp;
                        }
                    }

                }else { //Swiped Up 
                    queue.reverse();
                    for (let back = col; back < this.gameState.board.length; back = back + size){
                        let temp = queue.pop();
                        if (temp === undefined){
                            newBoard[back] = 0;
                        } else if(temp === queue[queue.length-1]) {
                            queue.pop();
                            newBoard[back]=temp*2;
                        }else{
                            newBoard[back] = temp;
                        }
                    }
                }
            }

        } else{ //Left and Right case
            let queue = new Array();
            for (let row = 0; row < this.gameState.board.length; row = row + size){
                for (let cell = row; cell < row + size; cell++){
                    let current = newBoard[cell];
                    if (current != 0){
                        queue.push(current);
                        newBoard[row] = 0;          
                    }
                }

                if (direction === "left"){ // shift left
                    queue.reverse();
                    for (let back= row; back < row + size; back++){
                        let temp = queue.pop();
                        if (temp === undefined){
                            newBoard[back] = 0;
                        } else if(temp === queue[queue.length-1]) {
                            queue.pop();
                            newBoard[back]=temp*2;
                        }else{
                            newBoard[back] = temp;
                        }

                    }
                } else { // shift right
                    for(let back = row + (size -1); back >= row; back-- ){
                        let temp = queue.pop();
                        if (temp === undefined){
                            newBoard[back] = 0;
                        } else if(temp === queue[queue.length-1]) {
                            queue.pop();
                            newBoard[back]=temp*2;
                        }else{
                            newBoard[back] = temp;
                        }
                    }
                    
                }
            }  
        }

        if (JSON.stringify(newBoard) === JSON.stringify(pureSad)){
            return true;
        } else { 
            return false;
        }

    }


}


