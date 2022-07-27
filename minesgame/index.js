let gameOver = false;
let timer = false;
let boardData ='';
document.getElementById("width").addEventListener('keypress',(event) => {
   event.preventDefault()
});
document.getElementById("height").addEventListener('keypress',(event) => {
    event.preventDefault()
});

document.getElementById("mines").addEventListener('keypress',(event) => {
    event.preventDefault()
});

document.getElementById('play').addEventListener('click',() => {
   
    let width = document.getElementById("width").value;
    let height = document.getElementById("height").value;
    document.getElementById('game-header').setAttribute('class','hide')
    let tbody = document.getElementById('tbody');
    tbody.innerHTML = '';
    let html = ''; 
    for(let row = 0; row < width; row++){
        html += '<tr>';
        for(let column = 0; column < height; column++){
            html += '<td class="p-4 bg-light cell" id="'+[row + '' + column]+'" data-opened="false" data-mine="false" data-flagged="false" data-first="true" onclick="handleClick(this.id)"></td>';
        }
        html += '</tr>';
    }
    tbody.innerHTML = html;
})

function createBoard(width,height,mineCount,currentCell){
    let board = {}
    for(let row = 0; row < width; row++){
        for(let column = 0; column < height; column++){
            board[row + '' + column] = cell(row,column,false,false,false,0)
        }
    }   
    
    board = randomlyAssignMines(board,mineCount,width,currentCell);
    board = calculateNeighborMineCounts(board,width);
    return board;
}
function cell(row,column,opened,flagged,mined,neighborMineCount){
    return {
        id:row + ''+ column, //unique if of cell
        row:row,    //horizontal position of the cell within the board.
        column:column,   //vertical position of the cell within the board.
        opened:opened,    //cell is open or not boolean value
        flagged:flagged,   // flag is placed on cell or not boolean value
        mined:mined,        // cell has been mined boolean value
        neighborMineCount:neighborMineCount   // number of neighboring cell containing a mine.
    }
}
const randomlyAssignMines = (board, mineCount,width,currentCell) => {
    let minesPosition = [];

    for(let i = 0; i < mineCount; i++){
        let x = getRandomInteger(0,width);
        let y = getRandomInteger(0,width);
        let cell = x+""+y;
        while(minesPosition.includes(cell)){
            x = getRandomInteger(0,width);
            y = getRandomInteger(0,width);
            cell = x+""+y;
        }
        if(currentCell === cell){
            x = getRandomInteger(0,width);
            y = getRandomInteger(0,width);
            cell = x+""+y;
        }
        minesPosition.push(cell);
        board[cell].mined = true;
    
    }
    return board;
}   

const getRandomInteger = (min,max) => {
   return Math.floor(Math.random() * (max - min)) + min;
}
	
const calculateNeighborMineCounts = (board, width) => {
    let cell;
    let neighborMineCount = 0;
    let id = '';
    let neighbors = [];
    for(let row = 0; row < width; row++){
        for(let column = 0; column < width; column++){
           id = row + '' + column;
           cell = board[id];
           if(!cell.mined){
                neighbors = getNeighbors(id);
                neighborMineCount = 0;
                for(let k = 0; k < neighbors.length; k++){
                   neighborMineCount += isMined(board,neighbors[k]);
                }
                cell.neighborMineCount = neighborMineCount;
           }

        }
    }
    return board;
}


const getNeighbors = (id) => {
    let row = parseInt(id[0]);
    let column = parseInt(id[1]);

    let neighbors = [];
    neighbors.push((row - 1) + "" + (column - 1));
    neighbors.push((row - 1) + "" + (column));
    neighbors.push((row - 1) + "" + (column + 1));
    neighbors.push((row) + "" + (column - 1));
    neighbors.push((row) + "" + (column + 1));
    neighbors.push((row + 1) + "" + (column - 1));
    neighbors.push((row + 1) + "" + (column));
    neighbors.push((row + 1) + "" + (column + 1));

    for(let k = 0; k < neighbors.length; k++){
        if(neighbors[k].length > 2){
            neighbors.splice(k,1);
            k--;
        }
    }
    return neighbors;
}

const isMined = (board,id) => {

    let cell = board[id];
    let mined = 0;
   
    if(cell != undefined){
        mined = cell.mined ? 1 : 0;
    }
    return mined;
}



const handleClick = (id) =>  {
    if(boardData == ''){
        let width = document.getElementById("width").value;
        let height = document.getElementById("height").value;
        let mineCount = document.getElementById("mines").value;
        boardData = createBoard(width,height,mineCount,id);
    }

    if(!gameOver){
        let cell = boardData[id];
        let $cell = document.getElementById(''+id+'');
        if(!cell.opened){
            if(!cell.mined){
                cell.opened = true;
                if(cell.neighborMineCount > 0){
                    $cell.innerHTML = cell.neighborMineCount;
                }else{
                    $cell.innerHTML = '';
                    $cell.classList.add("pink");
                    let neighbors = getNeighbors(id);
                    for(let k = 0; k < neighbors.length; k++){
                        let neighbor = neighbors[k];
                        if(typeof boardData[neighbor] !== "undefined" && !boardData[neighbor].opened){
                            handleClick(neighbor);
                        }
                    }
                }
            }else{
               $cell.classList.add('bomb');
               gameOver =true;
               document.getElementById('gameover').classList.remove('hide');
            }
        }
    }
}
const handleGameAgain = () => {
    window.location.reload();
}



