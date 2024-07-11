


function Tile(props) {


    let sendCurrTile = props.sendCurrTile;
    let sendOtherTile = props.sendOtherTile;
    let move = props.move;
    let color = "";
    const row = Math.floor((props.index/8));
    const col = (props.index%8);
    let id=`${row}-${col}`;
    if ((row + col)%2 == 1) {
    if(row < 3) {color = "white";} else if (row > 4) {color = "black";}
    }

    let dragOver = (event) => {
        event.stopPropagation();
        event.preventDefault();
    }

    let dragEnter = (event) => {
        event.stopPropagation();
        event.preventDefault();   
    }


return(
    
    <div className="tile"
    style={(row + col)%2 == 0 ? {backgroundColor: "rgb(236,190,121)"} : {backgroundColor: "rgb(74,52,19)"}}
    >
     <div 
    className="piece" 
    style={{backgroundColor:color}} 
    id={`${row}-${col}`} 
    draggable="true"
    onDragStart={()=>{sendCurrTile(id);
        //solution for making an element not visible when being dragged 
        //(referring the one that was initially clicked on before the drag started and not the one shown with less opacity)
        setTimeout(function() {
            document.getElementById(id).style.visibility = "hidden";
          }, 1);
    }}
    onDragOver={dragOver}
    onDragEnter={dragEnter}
    onDrop = {()=>{sendOtherTile(id);}}
    onDragEnd={()=>{move();
        //make element visible again
        setTimeout(function() {
            document.getElementById(id).style.visibility = "";
          }, 1);
    }}
    >
        <h2 id={`${row}-${col}-title`}></h2>
    </div>
    </div>
)
}

export default Tile;