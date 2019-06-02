var score = 0;
var showScore = document.getElementById('score');
var originalBoard;
const human = 'O';
const comp = 'X';
const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

const cells = document.querySelectorAll('.cell')

startGame();

function startGame()
{
    document.querySelector(".endGame").style.display = "none";
    originalBoard = Array.from(Array(9).keys());
    showScore.innerHTML = "score: " + score;
    for(var i = 0;i < cells.length;i++)
    {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(sqr)
{
    if(typeof originalBoard[sqr.target.id] == 'number')
    {
        turn(sqr.target.id, human)
        if(!checkTie()) turn(bestSpot(), comp);
    }
}

function turn(sqrId, player)
{
    originalBoard[sqrId] = player;
    document.getElementById(sqrId).innerText = player;
    let gameWon = checkWin(originalBoard, player);
    if(gameWon) gameOver(gameWon)
}

function checkWin(board, player)
{
    let plays = board.reduce((a,e,i) => (e===player) ? a.concat(i) : a, []);
    let gameWon = null;
    for(let [index,win] of winCombos.entries())
    {
        if(win.every(elem => plays.indexOf(elem) > -1))
    {
        gameWon = {index: index, player, player};
        break;
    }
    }
    return gameWon;
}

function gameOver(gameWon)
{
    for(let index of winCombos[gameWon.index])
    {
        document.getElementById(index).style.backgroundColor = gameWon.player == human ? "blue" : "red";
    }
    for(var i=0;i<cells.length;i++)
    {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == human ? "You Won!" : "You Lost!")
}

function declareWinner(who)
{
    document.querySelector(".endGame").style.display = "block"
    document.querySelector(".endGame .text").innerText = who;
    if(who === "You Won!") {score++;}
}

function emptySquares()
{
    return originalBoard.filter(s => typeof s =='number');
}

function bestSpot()
{
    return minimax(originalBoard, comp).index;
}

function checkTie()
{
    if(emptySquares().length == 0)
    {
        for(var i=0;i < cells.length;i++)
        {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click',turnClick, false);
        }
        declareWinner("Tie Game!");
        return true;
    }
    return false;
}

function minimax(newBoard, player)
{
    var availSpots = emptySquares(newBoard);

    if(checkWin(newBoard, human))
    {
        return {score: -10};
    }
    else if(checkWin(newBoard, comp))
    {
        return {score: 20};
    }
    else if(availSpots.length === 0)
    {
        return {score: 0};
    }
    var moves = [];
    for(var i=0; i < availSpots.length; i++)
    {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if(player == comp)
        {
            var result = minimax(newBoard, human);
            move.score = result.score;
        }
        else
        {
            var result = minimax(newBoard, comp);
            move.score = result.score;
        }
        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if(player === comp)
    {
        var bestScore = -10000;
        for(var i=0;i<moves.length;i++)
        {
            if(moves[i].score > bestScore)
            {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    else
    {
        var bestScore = 10000;
        for(var i=0; i <moves.length; i++)
        {
            if(moves[i].score < bestScore)
            {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}

function postInfo()
{
    var form = document.getElementById('postForm');
    var playerName = document.getElementById("playerName").value;
    if(playerName !== "")
    {
        var data = {name : playerName, score: score};

        fetch("https://5cd130b0d4a78300147be599.mockapi.io/Score",
            {
                method: 'post',
                headers:
                {
                    'Accept' : 'application/json, text/plain, */*',
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(data)
            })
    .then(postRes => postRes.json())
    console.log("posted" + data);
    }

    form.reset();
}
