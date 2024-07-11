import React from 'react';
import { useState } from "react";
import Tile from './Tile.jsx';
import {checkJump,checkGameState,checkPossibleMove} from '../script.js'
function Board() {
   

let initialBoardConfig = [
    [0,2,0,2,0,2,0,2],
    [2,0,2,0,2,0,2,0],
    [0,2,0,2,0,2,0,2],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [1,0,1,0,1,0,1,0],
    [0,1,0,1,0,1,0,1],
    [1,0,1,0,1,0,1,0]
];

const [boardConfig,setBoardConfig] = useState(initialBoardConfig);
const [currTileId,setCurrTileId] = useState("");
const [otherTileId,setOtherTileId] = useState("");
const[lastX, setLastX] = useState(-1);
const[lastY, setLastY] = useState(-1);
const[lastColor, setLastColor] = useState("");
const[nextJumpAvail, setNextJumpAvail] = useState(false);
const[lastWasJump,setLastWasJump] = useState(false);
const [turn,setTurn] = useState(1); //for which color to move (chained jumps)
const [turnCount, setTurnCount] = useState(1);
const[captureTurn, setCaptureTurn] = useState(1);
const[gameEnded, setGameEnded] = useState(false);
const[allPositions,setAllPositions] = useState([initialBoardConfig]);

function updateCurrTile(id) {
    setCurrTileId(id);
}

function updateOtherTile(id) {
    setOtherTileId(id);
}

function move() {
    if(gameEnded) {return;}
   
    let destroyX = -1;
    let destroyY = -1;
    let currTile = document.getElementById(currTileId);
    let otherTile = document.getElementById(otherTileId);

    let currTileColor = currTile.style.backgroundColor;
    let otherTileColor = otherTile.style.backgroundColor;

    let currX = parseInt(currTileId[2]); let currY = parseInt(currTileId[0]);
    let otherX = parseInt(otherTileId[2]); let otherY = parseInt(otherTileId[0]);

    let currTileNum = boardConfig[currY][currX];
    let otherTileNum = boardConfig[otherY][otherX];

    let title = document.getElementById(`${currTileId}-title`).textContent;
    
   
    //check for the correct side to move based on turn parity
    if ((turn%2 == 1 && currTileColor == "white") || (turn%2 == 0 && currTileColor == "black")) {return;}
    //stops the player from moving a piece directly onto another piece
    if (currTileColor == otherTileColor || (currTileColor == "white" && otherTileColor == "black") || (currTileColor == "black" && otherTileColor == "white")) {return;}
   

    //jump/capture chain conditions; made impossible to enter this block without a jump having already been done on the previous move
    if (lastX != -1 && lastY != -1 && lastColor != "" && lastWasJump && nextJumpAvail) {
        
        //checks whether a jump is possible in a direction and if the player made inputs for the jump; see script.js for more info on checkJump
        if (checkJump(currTileColor,lastX,lastY,otherX,otherY,boardConfig,"NW",title)) {

            //refer to updateAfterJump documentation below for more info
            updateAfterJump(currTileColor,lastX,lastY,otherX,otherY,boardConfig,"NW", title);
             destroyX = (currX + otherX)/2;
            destroyY = (currY + otherY)/2;
            //set the x and y values for the tile being captured so that it can later "disappear" via its backgroundColor being set to ""

        } else if (checkJump(currTileColor,lastX,lastY,otherX,otherY,boardConfig,"NE",title)) {

            updateAfterJump(currTileColor,lastX,lastY,otherX,otherY,boardConfig,"NE", title);
             destroyX = (currX + otherX)/2;
            destroyY = (currY + otherY)/2;

        } else if (checkJump(currTileColor,lastX,lastY,otherX,otherY,boardConfig,"SW",title)) {

            updateAfterJump(currTileColor,lastX,lastY,otherX,otherY,boardConfig,"SW", title);
             destroyX = (currX + otherX)/2;
            destroyY = (currY + otherY)/2;

        } else if (checkJump(currTileColor,lastX,lastY,otherX,otherY,boardConfig,"SE",title)) {

            updateAfterJump(currTileColor,lastX,lastY,otherX,otherY,boardConfig,"SE", title);
             destroyX = (currX + otherX)/2;
            destroyY = (currY + otherY)/2;

            //note that turn is not incremented in the middle of a jump/capture chain but only at the end of the chain
            //this update occurs in updateAfterJump if another jump with the same piece is not possible
        } else {return;}


     
    } else {
       //enters here if a jump has not been made on the previous move or if it has but another jump with the same piece is impossible
       

       //difference here is the arguments being passed into checkJump and updateAfterJump
        if (checkJump(currTileColor,currX,currY,otherX, otherY,boardConfig,"NW",title)) {

            updateAfterJump(currTileColor,currX,currY,otherX,otherY,boardConfig,"NW", title);
            destroyX = (currX + otherX)/2;
            destroyY = (currY + otherY)/2;
           
        } else if (checkJump(currTileColor,currX,currY,otherX, otherY,boardConfig,"NE",title)) {

            updateAfterJump(currTileColor,currX,currY,otherX,otherY,boardConfig,"NE", title);
            destroyX = (currX + otherX)/2;
            destroyY = (currY + otherY)/2;

        } else if (checkJump(currTileColor,currX,currY,otherX, otherY,boardConfig,"SW",title)) {

            updateAfterJump(currTileColor,currX,currY,otherX,otherY,boardConfig,"SW", title);
            destroyX = (currX + otherX)/2;
            destroyY = (currY + otherY)/2;

        } else if (checkJump(currTileColor,currX,currY,otherX, otherY,boardConfig,"SE",title)) {

            updateAfterJump(currTileColor,currX,currY,otherX,otherY,boardConfig,"SW", title);
            destroyX = (currX + otherX)/2;
            destroyY = (currY + otherY)/2;

        } else {
            //enters if no attempt to jump/capture has been made

            //if the piece is not a king piece (normal)
            if(title != "K") {
            //prevents player from moving a piece incorrectly
            if(currTileColor == "white" && (Math.abs(currX - otherX) != 1 || (otherY - currY) != 1)) {return;}
            if(currTileColor == "black" && (Math.abs(currX - otherX) != 1 || (otherY - currY) != -1)) {return;}
            } else {
                //enters if the piece is a king piece

                if(Math.abs(currX - otherX) != 1 || Math.abs(currY - otherY) != 1) {return;}

                //moves the "K" king text on the piece around to the current piece
                document.getElementById(`${currTileId}-title`).textContent = "";
                document.getElementById(`${otherTileId}-title`).textContent = "K";
            }
            setLastWasJump(false);
            setTurn(turn + 1);
        }

       

    } 

   
    currTile.style.backgroundColor = otherTileColor;
    otherTile.style.backgroundColor = currTileColor;

    let newBoard = boardConfig.map((rowArr, y) => {
        return(
        rowArr.map((num,x)=>{
            if (x == destroyX && y == destroyY) {return 0;}
            if (x == currX && y == currY) {return otherTileNum;}
            else if (x == otherX && y == otherY) {return currTileNum;}
            else {return num;}
        })
    )
    });
    setBoardConfig(newBoard);
   
     
    //promotion conditions for a piece to become a king piece
    if(otherY == 0 || otherY == 7) {
        document.getElementById(`${otherTileId}-title`).textContent = "K";
    }


    setLastX(otherX); setLastY(otherY); setLastColor(currTileColor); setTurnCount(turnCount + 1);

    //end the game if conditions met
    if (checkGameState(newBoard, turnCount, captureTurn)) {return;}


    //check for three-fold repetition through a map with key-value pairs
    let allPositionStrings = new Map();
    for (let i = 0; i < allPositions.length; i++) {
        let key = allPositions[i].toString();
        //set the seen positions (in String form) as keys and their frequency as values
        if(allPositionStrings.has(key)) {allPositionStrings.set(key,allPositionStrings.get(key)+1);} else {
        allPositionStrings.set(key,1);
        }
    }
    for (let c of allPositionStrings.values()) {
        if (c >= 3) {setGameEnded(true); document.getElementById("winner").innerText = "Draw by three-fold repetition!"; return;}
    }

    //ends the game if one side still has pieces but no possible moves
    if (!checkPossibleMove(newBoard,"black")) {setGameEnded(true); document.getElementById("winner").innerText = "White won! Black has no possible move."; return;} else
    if (!checkPossibleMove(newBoard,"white")) {setGameEnded(true); document.getElementById("winner").innerText = "Black won! White has no possible move."; return;} 


    //clear the seen positions if a jump/capture has been made; not possible for repetition because one less piece
    if(lastWasJump) {
        setAllPositions([...allPositions.filter((a,index)=>index==allPositions.length-1),newBoard]);
    } else {setAllPositions([...allPositions, newBoard]);}
}


//updates certain values after a jump/capture has been performed
//@param    color       String  the current color of the side whose turn it is
//@param    currX       int     the initial/current x position (starting 0 farthest left and increasing toward the right) of the piece being moved
//@param    currY       int     the initial/current y position (starting 0 farthest up and increasing toward the bottom) of the piece being moved
//@param    otherX      int     the target x position of where the user dragged the piece to
//@param    otherY      int     the target y position of where the user dragged the piece to
//@param    board       int[][] a 2D array of numbers of the board configuration where 0 represents an empty square, 1 represents a black piece, and 2 represents a white piece
//@param    direction   String  a two-character string representing the direction of jump/capture; only possible values are "NW","NE","SW", and "SE"
//@param    title       String  the title of the piece indicating whether it is a king piece or not; only possible values are "" and "K"
//@return               void
//@see script.js
function updateAfterJump(color, currX, currY, otherX, otherY, board, direction, title) {
    //variables used to generalize index input for an array later on; made because white/black move in opposite directions when non-king and it reduces repetition in code
    let signX = 1;
    let signY = 1;
    let secondDirection;
    if (direction[0] == "N") {signY = -1;}
    if(direction[1] == "W") {signX = -1; secondDirection = direction[0]+"E";} else {secondDirection = direction[0]+"W";}

    //remove the color from the captured piece; average of curr and other is used to find the piece inbetween because of vagueness in the direction of the jump/capture
    document.getElementById(`${(currY + otherY)/2}-${(currX + otherX)/2}`).style.backgroundColor = "";
    let destroyTileTitle = document.getElementById(`${(currY + otherY)/2}-${(currX + otherX)/2}-title`);
    if (destroyTileTitle.textContent == "K") {destroyTileTitle.textContent = "";}

    //makes sure that the "K" text is not left behind when a king piece is moved elsewhere during a capture
    if (title == "K") {
    document.getElementById(`${currTileId}-title`).textContent = "";
    document.getElementById(`${otherTileId}-title`).textContent = "K";
    }
    setLastWasJump(true);
   
    //checks jumps in only two directions for non-king pieces and all four for king pieces
    if((title != "K" && 
        (checkJump(color,otherX,otherY,(otherX + signX*2),(otherY + signY*2),board,direction,title) 
        || checkJump(color,otherX,otherY,(otherX - signX*2),(otherY + signY*2),board,secondDirection,title)))
    || title == "K" && (
        checkJump(color,otherX,otherY, otherX - 2, otherY - 2, board, "NW", title)
        || checkJump(color,otherX,otherY, otherX + 2, otherY - 2, board, "NE", title)
        || checkJump(color,otherX,otherY, otherX - 2, otherY + 2, board, "SW", title)
        || checkJump(color,otherX,otherY, otherX + 2, otherY + 2, board, "SE", title)
    )) {
        setTurn(turn);
        setNextJumpAvail(true);
    } else {setTurn(turn+1); setNextJumpAvail(false);}
    setCaptureTurn(turnCount);
}
   

   const numOfTiles = 64;
   const tilesArray = new Array(numOfTiles).fill(0);

    return(
        <>
        <div className="board">
            {tilesArray.map((_,index) => 
                    <Tile 
                    key={`${Math.floor(index/8)}-${index%8}`}
                    index={index}
                    sendCurrTile = {updateCurrTile}
                    sendOtherTile = {updateOtherTile}
                    move = {move}
                    ></Tile>
                )}
    
        </div>
        </>
    );

} 

export default Board;