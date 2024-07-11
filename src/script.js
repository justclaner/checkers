
// Returns true or false if a piece jump/capture can be done in a certain direction,
// and if so, whether player inputs correctly communicate the desire to jump/capture in that direction
//@param    color       String  the current color of the side whose turn it is
//@param    currX       int     the initial/current x position (starting 0 farthest left and increasing toward the right) of the piece being moved
//@param    currY       int     the initial/current y position (starting 0 farthest up and increasing toward the bottom) of the piece being moved
//@param    otherX      int     the target x position of where the user dragged the piece to
//@param    otherY      int     the target y position of where the user dragged the piece to
//@param    board       int[][] a 2D array of numbers of the board configuration where 0 represents an empty square, 1 represents a black piece, and 2 represents a white piece
//@param    direction   String  a two-character string representing the direction of jump/capture; only possible values are "NW","NE","SW", and "SE"
//@param    title       String  the title of the piece indicating whether it is a king piece or not; only possible values are "" and "K"
//@return               boolean true or false whether the jump/capture is possible in a certain direction and if the player made the correct input to do so
export  function checkJump(color, currX, currY, otherX, otherY, board, direction, title) {
    if (otherX < 0 || otherX > 7 || otherY < 0 || otherY > 7) {return false;}
    if (title != "K") {
        switch(direction) {
            case "NW":  //northwest
                if(currX < 2 || currY < 2) {return false;}
                if(color == "black" && board[currY-1][currX-1] == 2 && board[currY-2][currX-2] == 0 && (currX - otherX) == 2 && (currY - otherY) == 2) {
                 return true;
                }
            break;
            case "NE":  //northeast
               if(currX > 5 || currY < 2) {return false;}
               if(color == "black" && board[currY-1][currX+1] == 2 && board[currY-2][currX+2] == 0 && (currX - otherX) == -2 && (currY - otherY) == 2) {
                return true;
                }
            break;
            case "SW":  //southwest
                if(currX < 2 || currY > 5) {return false;}
                if(color == "white" && board[currY+1][currX-1] == 1 && board[currY+2][currX-2] == 0 && (currX - otherX) == 2 && (currY - otherY) == -2) {
                    return true;
                }
            break;
            case "SE":  //southeast
                if(currX > 5 || currY > 5) {return false;}
                if(color == "white" && board[currY+1][currX+1] == 1 && board[currY+2][currX+2] == 0  && (currX - otherX) == -2 && (currY - otherY) == -2) {
                    return true;
                }
            break;
        }
    } else {
        switch (direction) {
        case "NW":
            if(currX < 2 || currY < 2) {return false;}
            if (board[currY-2][currX-2] == 0 && (currX - otherX) == 2 && (currY - otherY) == 2 && ((color == "black" && board[currY-1][currX-1] == 2) || (color == "white" && board[currY-1][currX-1] == 1))) {
               return true;
            }
            break;
        case "NE":
            if(currX > 5 || currY < 2) {return false;}
            if (board[currY-2][currX+2] == 0 && (currX - otherX) == -2 && (currY - otherY) == 2 && ((color == "black" && board[currY-1][currX+1] == 2) || (color == "white" && board[currY-1][currX+1] == 1))) {
                return true;
             }
             break;
        case "SW":
            if(currX < 2 || currY > 5) {return false;}
            if (board[currY+2][currX-2] == 0 && (currX - otherX) == 2 && (currY - otherY) == -2 && ((color == "black" && board[currY+1][currX-1] == 2) || (color == "white" && board[currY+1][currX-1] == 1))) {
                return true;
             }
             break;
        case "SE":
            if(currX > 5 || currY > 5) {return false;}
            if (board[currY+2][currX+2] == 0  && (currX - otherX) == -2 && (currY - otherY) == -2 && ((color == "black" && board[currY+1][currX+1] == 2) || (color == "white" && board[currY+1][currX+1] == 1))) {
                return true;
             }
             break;
        }
    }
    return false;
}


//Checks basic game-ending conditions, changes the text to display the winner (or a draw) with the reason, and returns true or false whether a game has ended
//@param arr            int[][] a 2D number array of the board configuration
//@param turnCount      int     the number of turns that has passed since the beginning;
//                              a turn is defined by a color change, meaning individual jumps within a jump/capture chain don't count
//@param captureTurn    int     the last turn where a jump/capture was performed
//@return               boolean true or false whether one of the conditions for a game to end has been met
//@see checkJump

export  function checkGameState(arr, turnCount, captureTurn) {
    let hasBlack = false;
    let hasWhite = false;
for (let i = 0; i < arr.length; i++) {
    for(let j = 0; j < arr[i].length; j++) {
        let num = arr[i][j];
        if (num == 1) {hasBlack = true;}
        if (num == 2) {hasWhite = true;}
    }
}
if (hasBlack && !hasWhite) {setGameEnded(true); document.getElementById("winner").innerText = "Black Won! White has no more pieces."; return true;} else
if (!hasBlack && hasWhite) {setGameEnded(true); document.getElementById("winner").innerText = "White Won! Black has no more pieces."; return true;} else
if (turnCount >= captureTurn + 40) {setGameEnded(true); document.getElementById("winner").innerText = "Draw by 50 moves!"; return true;}
return false;
}


//handles the more complicated condition to end the game by draw of no possible moves; checks all pieces on the board
//@param    board   int[][] a 2D number array of the board configuration
//@param    color   String  the color of the side whose possibility of a move is being checked
//@return           boolean true or false whether a possible move, including jumps/captures
export  function checkPossibleMove(board, color) {
    for(let y = 0; y < board.length; y++) {
        for (let x = 0; x < board[y].length; x++) {
            let title = document.getElementById(`${y}-${x}-title`).textContent;
            let tile = board[y][x];


            if (tile == 0) {continue;}
            if (color == "black" && tile == 2) {continue;}
            if (color == "white" && tile == 1) {continue;}
            
            let oppNum = ( tile == 1)? 2 : 1;
            if (title != "K") { //if not king piece

                if (tile == 1) {//black
                    //light square checks are skipped because it's impossible to have a piece there with only diagonal moves

                    //there are so many conditionals here because
                    //for certain squares and depending on the color, jumps are only possible in certain directions, making a generalized complex conditional impossible in this case
                    //as an index out of range error will occur in these instances, and try...catch statements would skip the entire complex conditional statement despite some of the
                    //individual conditional statements (surrounded by an OR expression) would be true
                    if (y > 1 && x == 0) { //left side 
                        if(board[y-1][1] == 0 || (board[y-1][1] == 2 && board[y-2][2] == 0)) {return true;}
                    } else if (y == 1 && x == 0) {//tile below NW corner
                        if (board[0][1] == 0) {return true;}
                    } else if (y > 1 && x == 7) { //right side
                        if(board[y-1][6] == 0 || (board[y-1][6] == 2 && board[y-2][5] == 0)) {return true;}
                    } else if (y > 1 && x == 1) {//second wall from the left
                        if(board[y-1][0] == 0 || board[y-1][2] == 0 || (board[y-1][2] == 2 && board[y-2][3] == 0)) {return true;}
                    } else if (y > 1 && x == 6) {//second wall from the right
                        if(board[y-1][7] == 0 || board[y-1][5] == 0 || (board[y-1][5] == 2 && board[y-2][4] == 0)) {return true;}
                    }  else if (y == 1 && x == 6){ //diagonally adjacent from NE corner
                        if(board[0][7] == 0 || board[0][5] == 0) {return true;}
                    } else if (y == 1 && x > 1 && x < 6) {//second row from top
                        if(board[y-1][x-1] == 0 || board[y-1][x+1] == 0) {return true;}
                    } else if (y > 1 && x > 1 && x < 6) {//middle area 
                        if(board[y-1][x-1] == 0 || board[y-1][x+1] == 0 || (board[y-1][x-1] == 2 && board[y-2][x-2] == 0) || (board[y-1][x+1] == 2 && board[y-2][x+2] == 0)) {return true;}
                    }
                } else if (tile == 2) {//white
                    if (y < 6 && x == 0) { //left side
                        if(board[y+1][1] == 0 || (board[y+1][1] == 1 && board[y+2][2] == 0)) {return true;}
                    } else if (y < 6 && x == 7) { //right side
                        if(board[y+1][6] == 0 || (board[y+1][6] == 1 && board[y+2][5] == 0)) {return true;}
                    } else if (y == 6 && x == 7){//tile above SE corner
                        if (board[7][6] == 0) {return true;}
                    } else if (y < 6 && x == 1) {//second wall from the left
                        if(board[y+1][0] == 0 || board[y+1][2] == 0 || (board[y+1][2] == 1 && board[y+2][3] == 0)) {return true;}
                    } else if (y == 6 && x == 1) {//diagonally adjacent from SW corner
                        if(board[7][0] == 0 || board[7][2] == 0) {return true;}
                    } else if (y < 6 && x == 6) {//second wall from the right
                        if(board[y+1][7] == 0 || board[y+1][5] == 0 || (board[y+1][5] == 1 && board[y+2][4] == 0)) {return true;}
                    } else if (y == 6 && x > 1 && x < 6) {//second row from bottom
                        if(board[y+1][x-1] == 0 || board[y+1][x+1] == 0) {return true;}
                    } else if (y < 6 && x > 1 && x < 6) {//middle area 
                        if(board[y+1][x-1] == 0 || board[y+1][x+1] == 0 || (board[y+1][x-1] == 1 && board[y+2][x-2] == 0) || (board[y+1][x+1] == 1 && board[y+2][x+2] == 0)) {return true;}
                    }
                    }
            } else { //if king piece
                    
                    if (y == 0 && x == 7){//NE corner
                        if(board[y+1][x-1] == 0 || (board[y+1][x-1] == oppNum && board[y+2][x-2] == 0)) {return true;}
                    } else if (y == 7 && x == 0){ //SW corner
                        if(board[y-1][x+1] == 0 || (board[y-1][x+1] == oppNum && board[y-2][x+2] == 0)) {return true;}
                    } else if (y == 0 && x > 1 && x < 6) { //top row
                        if(board[y+1][x-1] == 0 || board[y+1][x+1] == 0 || (board[y+1][x-1] == oppNum && board[y+2][x-2] == 0) || (board[y+1][x+1] == oppNum && board[y+2][x+2] == 0)) {return true;}
                    } else if (x == 0 && y > 1 && y < 6) { //left side
                        if(board[y+1][x+1] == 0 || board[y-1][x+1] == 0 || (board[y+1][x+1] == oppNum && board[y+2][x+2] == 0) || (board[y-1][x+1] == oppNum && board[y-2][x+2] == 0)) {return true;}
                    } else if (x == 7 && y > 1 && y < 6) { //right side
                        if(board[y+1][x-1] == 0 || board[y-1][x-1] == 0 || (board[y+1][x-1] == oppNum && board[y+2][x-2] == 0) || (board[y-1][x-1] == oppNum && board[y-2][x-2] == 0)) {return true;}
                    } else if (y == 7 && x > 1 && x < 6) { //bottom row
                        if(board[y-1][x-1] == 0 || board[y-1][x+1] == 0 || (board[y-1][x-1] == oppNum && board[y-2][x-2] == 0) || (board[y-1][x+1] == oppNum && board[y-2][x+2] == 0)) {return true;}
                    } else if (y == 0 && x == 1) {//tile right of NW corner
                        if(board[y+1][x-1] == 0 || board[y+1][x+1] == 0 || (board[y+1][x+1] == oppNum && board[y+2][x+2] == 0)) {return true;}    
                    } else if (y == 1 && x == 0) {//tile below NW corner
                        if(board[y-1][x+1] == 0 || board[y+1][x+1] == 0 || (board[y+1][x+1] == oppNum && board[y+2][x+2] == 0)) {return true;}    
                    } else if (y == 7 && x == 6) {//tile left of SE corner
                        if(board[y-1][x-1] == 0 || board[y-1][x+1] == 0 || (board[y-1][x-1] == oppNum && board[y-2][x-2] == 0)) {return true;}    
                    } else if (y == 6 && x == 7) {//tile above SE corner
                        if(board[y+1][x-1] == 0 || board[y-1][x-1] == 0 || (board[y-1][x-1] == oppNum && board[y-2][x-2] == 0)) {return true;}    
                    } else if (y == 1 && x == 6) {//diagonally adjacent from NE corner
                        if(board[y-1][x-1] == 0 || board[y-1][x+1] == 0 || board[y+1][x+1] == 0 || board[y+1][x-1] == 0 || (board[y+1][x-1] == oppNum && board[y+2][x-2] == 0)) {return true;}
                    } else if (y == 6 && x == 1) {//diagonally adjacent from SW corner
                        if(board[y-1][x-1] == 0 || board[y-1][x+1] == 0 || board[y+1][x+1] == 0 || board[y+1][x-1] == 0 || (board[y-1][x+1] == oppNum && board[y-2][x+2] == 0)) {return true;}
                    } else if (y == 1 && x > 1 && x < 6) {//second row from top
                        if(board[y-1][x-1] == 0 || board[y-1][x+1] == 0 || board[y+1][x+1] == 0 || board[y+1][x-1] == 0 
                            || (board[y+1][x+1] == oppNum && board[y+2][x+2] == 0) || (board[y+1][x-1] == oppNum && board[y+2][x-2] == 0)) {return true;}    
                    } else if (y == 1 && x > 1 && x < 6) {//second row from bottom
                        if(board[y-1][x-1] == 0 || board[y-1][x+1] == 0 || board[y+1][x+1] == 0 || board[y+1][x-1] == 0 
                            || (board[y-1][x+1] == oppNum && board[y-2][x+2] == 0) || (board[y-1][x-1] == oppNum && board[y-2][x-2] == 0)) {return true;}    
                    } else if (x == 1 && y > 1 && y < 6) {//second row from left
                        if(board[y-1][x-1] == 0 || board[y-1][x+1] == 0 || board[y+1][x+1] == 0 || board[y+1][x-1] == 0 
                            || (board[y+1][x+1] == oppNum && board[y+2][x+2] == 0) || (board[y-1][x+1] == oppNum && board[y-2][x+2] == 0)) {return true;}    
                    } else if (x == 1 && y > 1 && y < 6) {//second row from right
                        if(board[y-1][x-1] == 0 || board[y-1][x+1] == 0 || board[y+1][x+1] == 0 || board[y+1][x-1] == 0 
                            || (board[y+1][x-1] == oppNum && board[y+2][x-2] == 0) || (board[y-1][x-1] == oppNum && board[y-2][x-2] == 0)) {return true;}    
                    } else if (x > 1 && x < 6 && y > 1 && y < 6) {//middle
                        if(board[y-1][x-1] == 0 || board[y-1][x+1] == 0 || board[y+1][x+1] == 0 || board[y+1][x-1] == 0 
                            || (board[y-1][x-1] == oppNum && board[y-2][x-2] == 0)
                            || (board[y-1][x+1] == oppNum && board[y-2][x+2] == 0)
                            || (board[y+1][x-1] == oppNum && board[y+2][x-2] == 0) 
                            || (board[y+1][x+1] == oppNum && board[y+2][x+2] == 0)
                        ) {return true;}
                    }
            }
        }
    }
    return false;
}

