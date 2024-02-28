//Get the elements from the html
const gameboard = document.querySelector('#gameboard');
const playerDisplay = document.querySelector('#player');
const infoDisplay = document.querySelector("info-display");
//Width of the chessboard
const width = 8;
let playerGo= "white";
playerDisplay.textContent = "white";

//array with 64 items
const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook, 
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook, 
]


//display board

function createBoard() {
    startPieces.forEach((startPiece, numSquare) => {
        const square = document.createElement("div");
        square.classList.add("square");
        // Display every piece
        square.innerHTML = startPiece;
        square.setAttribute("square-id", numSquare);
         //make pieces dragable
         if (square.firstChild) {
            square.firstChild.setAttribute("draggable", true);
        }
        // Define what row we are in
        const row = Math.floor(numSquare / width) + 1;
        // Determine the square color
        if (row % 2 === 0) {
            square.classList.add(numSquare % 2 === 0 ? "beige" : "brown");
        } else {
            square.classList.add(numSquare % 2 === 0 ? "brown" : "beige");
        }
        // Turn first 16 squares to black
        if (numSquare < 16) {
            square.classList.add("black");
        }
        if (numSquare > 47) {
            square.classList.add("white");
        }
        gameboard.append(square);
    });
}



createBoard();




//grab every square


const allSquares = document.querySelectorAll("#gameboard .square");


allSquares.forEach(square => {
    square.addEventListener("dragstart", dragStart);
    square.addEventListener("dragover", dragOver);
    square.addEventListener("drop", dragDrop);
})

let startPositionId;
let draggedElement;

function dragStart(e){
  //console.log(e.target.parentNode.getAttribute("square-id"));
  startPositionId = e.target.parentNode.getAttribute("square-id");
  draggedElement = e.target;
}

function dragOver(e){
    e.preventDefault();
}


function dragDrop(e){
  e.stopPropagation();
  const taken = e.target.classList.contains("piece");
  

  changePlayer();

  //e.target.parentNode.append(draggedElement);
  //e.target.remove();
  
  //e.target.append(draggedElement);
}

console.log(allSquares);