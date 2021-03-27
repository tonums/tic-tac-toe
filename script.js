const playerFactory = (symbol, isAi, color) =>{
  let _symbol = symbol
  let _isAi = isAi
  let _color = color
  const getSymbol = () => _symbol
  const getColor = () => _color
  const getAi = () => _isAi
  return{getSymbol, getColor, getAi}
}

const domController = (() => {
  const cells = document.querySelectorAll(".cell")
  const endgame = document.querySelector(".endgame")
  const endgameText = document.querySelector(".text")

  const resetCellText = () => {
    cells.forEach(function (element){
      element.innerText=""
      element.style.color="black"
      endgame.style.display = "none"
    })
  }

  const setBoardEventListeners = () => {
    cells.forEach(function (element){
      element.addEventListener("click", game.clickTurn)
    })
  }

  const removeBoardEventListeners = () => {
    cells.forEach(function (element){
      element.removeEventListener("click", game.clickTurn)
    })
  }

  const highlightWinCombo = (indexes, player) =>{
    indexes.forEach(function (index){
      document.getElementById(index).style.color = player.getColor()
    })
  }

  const displayWinMessage = (player) =>{
    endgame.style.display = "inline"
    if(!player) endgameText.innerText = "It's a Tie"
    else if(!player.getAi()){
      endgameText.innerText = "Congratulations You won!"
    }else{
      endgameText.innerText = "Yikes. Computer won!"
    }
  }

  return {setBoardEventListeners, resetCellText, highlightWinCombo, removeBoardEventListeners, displayWinMessage}
})()

const game = (() => {

  let humanPlayer = playerFactory("X",false, "green")
  let aiPlayer = playerFactory("O",true, "red")

  const startGame = () =>{
    gameBoard.reset()
    domController.resetCellText()
    domController.setBoardEventListeners();
  }

  const clickTurn = (cell) => {
    turn(cell.target.id,humanPlayer)
  }

  const turn = (cellId, player = aiPlayer) => {
    if (gameBoard.addSymbol(player.getSymbol(),cellId)){
      document.getElementById(cellId).innerText = player.getSymbol()
      let win = checkWin(gameBoard.getBoard())
      if (win && win.winner=="tie"){
        endGame(null)
      }else if (win){
        domController.highlightWinCombo(win.index, player)
        endGame(player)
      }else if(!player.getAi()){
        gameAi.play(gameBoard.getBoard())
      }
    }
  }
  const endGame = (player) => {
    domController.displayWinMessage(player)
    domController.removeBoardEventListeners()
  }

  const checkWin = (board) =>{
    if (board[0] != ""){
      if (board[0] == board[1] && board[0] == board[2]){
        return {index: [0,1,2], winner: board[0]}
      }
      if (board[0] == board[3] && board[0] == board[6]){
        return {index: [0,3,6], winner: board[0]}
      }
      if (board[0] == board[4] && board[0] == board[8]){
        return {index: [0,4,8], winner: board[0]}
      }
    }
    if (board[4] != ""){
      if (board[4] == board[1] && board[4] == board[7]){
        return {index: [4,1,7], winner: board[4]}
      }
      if (board[4] == board[3] && board[4] == board[5]){
        return {index: [4,3,5], winner: board[4]}
      }
      if (board[4] == board[2] && board[4] == board[6]){
        return {index: [4,2,6], winner: board[4]}
      }
    }
    if (board[8] != ""){
      if (board[8] == board[2] && board[8] == board[5]){
        return {index: [8,2,5], winner: board[8]}
      }
      if (board[8] == board[6] && board[8] == board[7]){
        return {index: [8,6,7], winner: board[8]}
      }
    }

    if(gameBoard.isFull()){
      return {winner: "tie"}
    }
    return null
  }
 
  return {startGame, clickTurn, turn, checkWin}
})()

const gameBoard = (()=>{
  _board = ["","","","","","","","",""]

  const addSymbol = (symbol, position) =>{
    if (_board[position] == ""){
      _board[position] = symbol
      return 1
    }
    return 0
  }
  const isFull = () =>{
    for (let i = 0; i < _board.length; i++){
      if (_board[i] == ""){
        return false
      }
    }
    return true
  }
  const getBoard = () => _board
  const reset = () => {
    _board = ["","","","","","","","",""]
  }
  return {addSymbol, getBoard, reset, isFull}
})()

const gameAi = (()=>{
  let scores = {
    X: -1,
    O: 1,
    tie: 0
  }
  const play = (board)=> {
    /*let randomNumber = Math.floor(Math.random()*9)
    console.log(randomNumber)
    while(board[randomNumber] != ""){
      randomNumber = Math.floor(Math.random()*9)
    }
    game.turn(randomNumber)*/
    game.turn(bestMove(board))
  }

  const bestMove = (board) =>{
    let bestScore = -Infinity
    let move
    board.forEach(function(cell, index) {
      if (cell == ""){
        board[index] = "O"
        let score = minimax(board, 0, false)
        board[index] = ""
        if (score>bestScore){
          bestScore = score
          move = index
        }
      }
    })
    return move
    }

    const minimax=(board, depth, isMaximizing) => {
      let result = game.checkWin(board)
      if (result !== null){
        return scores[result.winner]
      }
      if (isMaximizing){
        let bestScore = -Infinity
        board.forEach(function(cell, index) {
          if (cell == ""){
            board[index] = "O"
            let score = minimax(board, depth+1, false)
            board[index] = ""
            bestScore = Math.max(score, bestScore)
          }
        })
        return bestScore
      }else{
        let bestScore = Infinity
        board.forEach(function(cell, index) {
          if (cell == ""){
            board[index] = "X"
            let score = minimax(board, depth + 1, true)
            board[index] = ""
            bestScore = Math.min(score, bestScore)
          }
        })
        return bestScore
      }
    }
  return {play}
})()
game.startGame()