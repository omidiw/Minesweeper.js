// Display/ui
import { TILE_STATUSES, createBoard, markTile, revealTile, checkWin, checkLose } from "./mineSweeper.js"
const BOARD_SIZE = 10
const NUMBER_OF_MINES = 5
const minesLeft = document.querySelector("[data-mine-count]")
const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES)
const boardElement = document.querySelector(".board")
const messageText = document.querySelector(".subtext")
board.forEach(row => {
  row.forEach(tile => {
    boardElement.append(tile.element)
    tile.element.addEventListener("click", () => {
      revealTile(board, tile)
      checkGameEnd()
    })
    tile.element.addEventListener("contextmenu", e => {
      e.preventDefault()
      markTile(tile)
      listMinesLeft()
    })
  })
})

boardElement.style.setProperty("--size", BOARD_SIZE)
minesLeft.textContent = NUMBER_OF_MINES
function listMinesLeft() {
  const markedTileCount = board.reduce((count, row) => {
    return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
  }, 0)

  minesLeft.textContent = NUMBER_OF_MINES - markedTileCount
}
function checkGameEnd() {
  const win = checkWin(board)
  const lose = checkLose(board)
  if (win || lose) {
    // the boardElement event listener is the parent of each tile
    // element so when we stop the propogation on it trough the caputre phase we gonna stop them from firing
    boardElement.addEventListener("click", stopProp, { capture: true })
    boardElement.addEventListener("contextmenu", stopProp, { capture: true })
  }
  if (win) {
    messageText.textContent = "You win"
  }
  if (lose) {
    messageText.textContent = "You lose"
    board.forEach(row => {
      row.forEach(tile => {
        if (tile.status === TILE_STATUSES.MARKED) markTile(tile)
        if (tile.mine) revealTile(board, tile)
      })
    })
  }
}
function stopProp(e) {
  e.stopImmediatePropagation()
}
// 1.populate the board with tiles/mines
// 2.left click on tiles
// reveal tiles
//3. right click on tiles
// a. mark tiles
//4. check for win/lose
