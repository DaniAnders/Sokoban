var Player = {
    current_x: 0,
    current_y: 0,
}

let mapGridArray = tileMap01.mapGrid;
let mapHeight = tileMap01.height;
let mapWidth = tileMap01.width;

var player;
var target;
var newPosition_x;
var newPosition_y;
var G = [];
const gameContainer = document.getElementById("game-container");
var win_ = false;

var Wall = Tiles.Wall;
var Space = Tiles.Space;
var Goal = Tiles.Goal;
var Character = Entities.Character;
var Block = Entities.Block;
var Block_Done = Entities.BlockDone;

const UP = 'ArrowUp';
const DOWN = 'ArrowDown';
const RIGHT = 'ArrowRight';
const LEFT = 'ArrowLeft';

var resetButton = document.getElementById("restart");


function addClassList(tile, mapGrid, position_x, position_y) {
    switch (mapGrid) {
        case ' ':
            tile.classList.add(Space);
            break;
        case 'W':
            tile.classList.add(Wall);
            break;
        case 'P':
            tile.classList.add(Character);
            Player.current_x = position_x;
            Player.current_y = position_y;
            break;
        case 'B':
            tile.classList.add(Block);
            tile.classList.add(Space);
            break;
        case 'G':
            tile.classList.add(Goal);
            tile.innerHTML="G";
            G.push("x" + column + "y" + row);
            break;
        default:
            break;
    }
}

/* Drawing map grid for the game */
function drawGrid() {

    let rows = document.getElementsByClassName("row");
   /* Creating the rows */
    for (let row = 0; row < mapHeight; row++) {
    let newRow = document.createElement("div");
    gameContainer.appendChild(newRow).className = "row";
    }
    /* Creating tiles for each row/column and adding id to each tile */
    for (column = 0; column < mapWidth; column++) {
        for (row = 0; row < rows.length; row++) {
            let newTile = document.createElement("div");
            newTile.id = "x" + column + "y" + row;
            rows[row].appendChild(newTile).className = "tile";
            addClassList(newTile, mapGridArray[row][column][0], column, row);
        }
    }
}


document.addEventListener('keydown', (event) => {
    if (event.key == UP || event.key == DOWN  || event.key == RIGHT || event.key == LEFT)
    {
        event.preventDefault();
        if (!win_) {
            switch (event.key) {
                case UP:
                    move(0, -1);
                    break;
                case DOWN:
                    move(0, 1);
                    break;
                case RIGHT:       
                    move(1, 0);
                    break;
                case LEFT:
                    move(-1, 0);
                    break;
                default:
                    break;
            }
        }
    }
}, false);


function block(x, y) {
    var target = document.getElementById("x" + x + "y" + y)
    if (target.classList.contains(Block)) {
        return true;
    }
    else {
        return false;
    }
}

function wall(x, y) {
    var target = document.getElementById("x" + x + "y" + y)
    if (target.classList.contains(Wall)) {
        return true;
    }
    else{
        return false;
    }
}


/* Moving the player, finding target tile
   checking for obstacles (wall or block), updating player´s position (target tile) */
function move(x, y) {
    newPosition_x = Player.current_x + x;
    newPosition_y = Player.current_y + y;
    player = document.getElementById("x" + Player.current_x + "y" + Player.current_y)
    target = document.getElementById("x" + newPosition_x + "y" + newPosition_y)

    if (!wall(newPosition_x, newPosition_y) && !block(newPosition_x, newPosition_y)){
        updatePosition(player, target, newPosition_x, newPosition_y);
    }else if(block(newPosition_x, newPosition_y)){
        moveBlock(x, y);   
    }
    if (win()) {
        alert("Congratulations! You won the game");
        win_ = true;
        reset();
        play();
    }
}

/* Checking whether wall or another block is in the target tile,
   updating the target location with the block object */
function moveBlock(x, y) {
    var blockObj;
    var target_x = newPosition_x + x;
    var target_y = newPosition_y + y;
    if (!wall(target_x, target_y) && !block(target_x, target_y)) {
        blockObj = document.getElementById("x" + target_x + "y" + target_y);
        target.classList.remove(Block);
        BlockDone(target);
        blockObj.classList.add(Block);
        BlockDone(blockObj);
        updatePosition(player, target, newPosition_x, newPosition_y);

    }

}

/* Adding block object on goal positions */
function BlockDone(blockObj) {
    if (blockObj.classList.contains(Block) && blockObj.classList.contains(Goal)) {
        if (!blockObj.classList.contains(Block_Done)) {
            blockObj.classList.add(Block_Done);
        }
    }
    else if (!blockObj.classList.contains(Block) && blockObj.classList.contains(Block_Done)) {
        blockObj.classList.remove(Block_Done);
    }
}

/* Updating the player´s position */
function updatePosition(player, target, newPosition_x, newPosition_y) {
    player.classList.remove(Character);
    target.classList.add(Character);
    Player.current_x = newPosition_x;
    Player.current_y = newPosition_y;
}

/* Checking if all goal positions contains blocks */
function win() {
    for (i = 0; i < G.length; i++) {
        var goal = document.getElementById(G[i]);
        if (!goal.classList.contains(Block)) {
            return false;
        }
    }
    return true;
}

/* Reseting the game */
function reset() {
    gameContainer.innerHTML = "";
    Player.current_y = 0;
    Player.current_x = 0;
    G = [];
}
/* Adding event listener to reset button */
resetButton.addEventListener("click", function() {
    reset();
    play();
    alert('Reset successfully!');
  });

function play() {
    drawGrid();
    win_ = false;
}


  play();