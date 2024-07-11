import Board from './components/Board.jsx';

function App() {


  return (
    <>
    <script async src="script.js"></script>
    <h1>Checkers</h1>
    <p>Two players required. <b><u>Drag to move.</u></b> Refresh to restart. Just a reminder that black goes first.</p>

    <div className="center">
    <Board></Board>
    </div>

    <div className="info">
      <p className="winner" id="winner"></p>

    <h3 style={{textAlign:"center"}}>Rules:</h3>
    <ol>
      <u>Players</u>
      <li>Black always goes first, and turns alternate between black and white.</li>
      <u>Piece movement</u>
      <li>Pieces initially move diagonally forward left or right one tile toward the opposite side of where they initially started.
          <ol type="a">
            <li>A piece may not move onto a piece regardless of the colors of both pieces.</li>
            <li>A piece may not move horizontally or vertically. This means a piece can never be on a white square/tile.</li>
            <li>A piece may not move out of the board.</li>
          </ol>
      </li>
      <u>King Pieces</u>
      <li>King Pieces, those that have been promoted by reaching the back row of the opposing side, are able to move diagonally in any direction if possible.</li>
      <u>Jumps/Captures</u>
      <li>When a piece A is diagonally adjacent to a piece B with another color, 
        and there is an empty space even further diagonally adjacent to piece B opposite the side of where piece A is diagonally adjacent,
        piece A may choose to jump over piece B to that aforementioned empty space and capture piece B, assuming that the direction of the jump is a legal as defined in rule 1.
        This is called a jump. <b>A jump, if possible and not in the middle of a jump/capture chain (see rule 3a.), is not forced. </b>
        However, there is no stopping those who wish to play by this rule to implement it on their own. In this case, if a player makes a move that is not a jump/capture 
        when one is possible, this player forfeits the game.
          <ol type="a">
          <u>Chained jumps/captures</u>
            <li>If piece A, after jumping over piece B, is able to jump over another piece C of the same color as piece B, the player controlling
              piece A must do so. Up to three chained jumps in a row are possible with non-king pieces and up to nine are possible for king pieces. 
              Once a jump has been played, <b>further jumps in the chain must be done if possible.</b> A player's turn is only counted after the last
              chained jump.</li>
          </ol>
        </li> <br/>
    </ol>

    <h3 style={{textAlign:"center"}}>Win/Draw Conditions:</h3>
    <ol>
      <li>A <b>win</b> occurs for a player when their color captures all the opposing color's pieces, or the opposing player has no possible moves to make. A <b>loss</b> occurs
      for the other player.</li>
      <li>A <b>draw</b> occurs in the following circumstances:
        <ol type="a">
          <li>Three-fold repetition. The same board configuration has occured three times.</li>
          <li>The 40 move rule. 40 moves have gone by without a capture.</li>
          <li>Player agreed draw. Two players agree to a draw. Note that this is not implemented into the game.</li>
        </ol>
      </li>
    </ol>
    </div>
    
   </>
  )
}

export default App
