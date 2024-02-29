const gameBoard = document.querySelector("#gameboard");
const playerDisplay = document.querySelector("#player");
const infoDisplay = document.querySelector("#info-display");
const width = 8;
let playerGo = "black";
playerDisplay.textContent = "black";

const startPieces = [
    rook, knight, bishop, queen, king, bishop, knight, rook,
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    "", "", "", "", "", "", "", "",
    pawn, pawn, pawn, pawn, pawn, pawn, pawn, pawn,
    rook, knight, bishop, queen, king, bishop, knight, rook
];

function createBoard() {
  startPieces.forEach((startPiece, i) => {
    const square = document.createElement("div");
    square.classList.add("square");
    square.innerHTML = startPiece;
    square.firstChild?.setAttribute("draggable", true);
    square.setAttribute("square-id", i);

    //square.classList.add("beige");

    //define what row we are in
    const row = Math.floor((63 - i) / 8) + 1;
    //color the squares. Thank you stackoverflow! :)
    if (row % 2 === 0) {
      square.classList.add(i % 2 === 0 ? "beige" : "brown");
    } else {
      square.classList.add(i % 2 === 0 ? "brown" : "beige");
    }
    // Add the "black" class to the first 16 squares if they contain a piece
    if (i < 16) {
      square.firstChild.classList.add("black");
    }
    if (i >= 48) {
      square.firstChild.classList.add("white");
    }

    gameBoard.append(square);
  });
}
createBoard();

//grab every square
const allSquares = document.querySelectorAll(".square");

allSquares.forEach((square) => {
  square.addEventListener("dragstart", dragStart);
  square.addEventListener("dragover", dragOver);
  //most important! ;-)
  square.addEventListener("drop", dragDrop);
});

let startPositionId;
let draggedElement;

function dragStart(e) {
  //we are interested in the parent (the square)
  //console.log(e.target.parentNode.getAttribute("square-id"))
  draggedElement = e.target;
  startPositionId = e.target.parentNode.getAttribute("square-id");
}

function dragOver(e) {
  e.preventDefault();
}

//it either drops into an empty square or eat other piece
function dragDrop(e) {
  e.preventDefault();
  e.stopPropagation();

  const targetSquare = e.target.classList.contains("square")
    ? e.target
    : e.target.parentNode;

  if (!draggedElement.classList.contains(playerGo)) {
    console.log("It's not your turn!");
    return;
  }

  const valid = checkIfValid(targetSquare);
  

  if (!valid) {
    console.log("Invalid move!");
    return;
  }
  
  console.log("Checking for en passant...");
  console.log("Start piece:", draggedElement.parentNode.textContent.trim());
  console.log("End piece:", targetSquare.textContent.trim());


  // If the target square contains a piece, check if it's the opponent's piece
  const takenPiece = targetSquare.querySelector(".piece");
  if (takenPiece) {
    const opponentColor = playerGo === "black" ? "white" : "black";
    if (!takenPiece.classList.contains(opponentColor)) {
      console.log("You can't capture your own piece!");
      return;
    }
    // Remove the captured piece from the board
    takenPiece.remove();
  }

  // Move the piece to the target square
  targetSquare.appendChild(draggedElement);

  // Change player turn
  changePlayer();
}

  

function changePlayer() {
  if (playerGo === "black") {
    playerGo = "white";
    playerDisplay.textContent = "white";
  } else {
    playerGo = "black";
    playerDisplay.textContent = "black";
  }
}

function reverseIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) =>
    square.setAttribute("square-id", width * width - 1 - i)
  );
}

function reverIds() {
  const allSquares = document.querySelectorAll(".square");
  allSquares.forEach((square, i) =>
    square.setAttribute("square-id", square.setAttribute(i))
  );
}
function checkIfValid(target) {
  const targetId =
    Number(target.getAttribute("square-id")) ||
    Number(target.parentNode.getAttribute("square-id"));
  const startId = Number(startPositionId);

  // Check if the move is valid for the pawn
  if (draggedElement.classList.contains("piece")) {
    const direction = playerGo === "black" ? 1 : -1;
    const forwardOne = startId + width * direction;
    const forwardTwo = startId + width * 2 * direction;
    const leftCapture = startId + width * direction - 1;
    const rightCapture = startId + width * direction + 1;

    if (draggedElement.classList.contains("black")) {
      if (startId >= 8 && startId <= 15) {
        if (targetId === forwardOne || targetId === forwardTwo) {
          return true; // Pawn double step logic
        }
      } else {
        if (targetId === forwardOne) {
          return true; // Pawn single step logic
        }
      }
      // Check for pawn capture
      if ((targetId === leftCapture || targetId === rightCapture) && target.querySelector('.piece.white')) {
        return true; // Pawn capture logic
      }
    } else if (draggedElement.classList.contains("white")) {
      if (startId >= 48 && startId <= 55) {
        if (targetId === forwardOne || targetId === forwardTwo) {
          return true; // Pawn double step logic
        }
      } else {
        if (targetId === forwardOne) {
          return true; // Pawn single step logic
        }
      }
      // Check for pawn capture
      if ((targetId === leftCapture || targetId === rightCapture) && target.querySelector('.piece.black')) {
        return true; // Pawn capture logic
      }
    }
  }

  // Check if the move is valid for other pieces
  switch (draggedElement.id) {
    case "rook":
      if (
        startId % width === targetId % width ||
        Math.floor(startId / width) === Math.floor(targetId / width)
      ) {
        console.log("Rook move is valid!");
        return true; // Rook logic: can move horizontally or vertically
      }
      break;
    case "knight":
      const validMoves = [
        startId - 17,
        startId - 15,
        startId - 10,
        startId - 6,
        startId + 6,
        startId + 10,
        startId + 15,
        startId + 17,
      ];
      if (validMoves.includes(targetId)) {
        return true; // Knight logic: L-shaped movement
      }
      break;
    case "bishop":
      if (
        Math.abs(startId - targetId) % 9 === 0 ||
        Math.abs(startId - targetId) % 7 === 0
      ) {
        return true; // Bishop logic: can move diagonally
      }
      break;
    case "queen":
      if (
        startId % width === targetId % width ||
        Math.floor(startId / width) === Math.floor(targetId / width)
      ) {
        return true; // Queen logic for rook-like movements
      }
      if (
        Math.abs(startId - targetId) % 9 === 0 ||
        Math.abs(startId - targetId) % 7 === 0
      ) {
        return true; // Queen logic for bishop-like movements
      }
      break;
    case "king":
      const kingMoves = [
        startId - 9,
        startId - 8,
        startId - 7,
        startId - 1,
        startId + 1,
        startId + 7,
        startId + 8,
        startId + 9,
      ];
      if (kingMoves.includes(targetId)) {
        return true; // King logic: can move one square in any direction
      }
      break;
    default:
      break;
  }

  return false; // Default: move is not valid
}
