export const TILE_STATUSES = {
  HIDDEN: "hidden",
  MINE: "mine",
  NUMBER: "number",
  MARKED: "marked",
}
export function createBoard(boardSize, numberOfMines) {
  const board = []
  const minePositions = getMinepositions(boardSize, numberOfMines)
  for (let x = 0; x < boardSize; x++) {
    const row = []
    for (let y = 0; y < boardSize; y++) {
      const element = document.createElement("div")
      element.dataset.status = TILE_STATUSES.HIDDEN
      const tile = {
        element,
        x,
        y,
        // Mine positions will be matched with our cordinates to have proper mine placing
        mine: minePositions.some(positionMatch.bind(null, { x, y })),
        // made our code cleaner by using status method
        get status() {
          return this.element.dataset.status
        },
        set status(value) {
          this.element.dataset.status = value
        },
      }
      row.push(tile)
    }
    board.push(row)
  }

  return board
}

export function markTile(tile) {
  // our tile should not be hidden and marked
  // because we put a getter and setter we don't have to manually write tile.element.dataset.status
  if (tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.MARKED) {
    return
  }
  if (tile.status === TILE_STATUSES.MARKED) {
    tile.status = TILE_STATUSES.HIDDEN
  } else {
    tile.status = TILE_STATUSES.MARKED
  }
}
export function revealTile(board, tile) {
  if (tile.status !== TILE_STATUSES.HIDDEN) {
    return
  }
  if (tile.mine) {
    tile.status = TILE_STATUSES.MINE
    return
  }
  tile.status = TILE_STATUSES.NUMBER
  const adjacentTiles = nearbyTiles(board, tile)
  const mines = adjacentTiles.filter(t => t.mine)
  if (mines.length === 0) {
    adjacentTiles.forEach(revealTile.bind(null, board))
  } else {
    tile.element.textContent = mines.length
  }
}
export function checkWin(board) {
  return board.every(row => {
    return row.every(tile => {
      return tile.status === TILE_STATUSES.NUMBER || (tile.mine && (tile.status === TILE_STATUSES.HIDDEN || tile.status === TILE_STATUSES.MARKED))
    })
  })
}
export function checkLose(board) {
  return board.some(row => {
    return row.some(tile => {
      return tile.status === TILE_STATUSES.MINE
    })
  })
}
function getMinepositions(boardSize, numberOfMines) {
  const positions = []
  while (positions.length < numberOfMines) {
    const position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize),
    }
    if (!positions.some(positionMatch.bind(null, positions))) {
      positions.push(position)
    }
  }
  return positions
}
function positionMatch(a, b) {
  return a.x === b.x && a.y === b.y
}

function randomNumber(boardSize) {
  return Math.floor(Math.random() * boardSize)
}
function nearbyTiles(board, { x, y }) {
  const tiles = []
  for (let xOffest = -1; xOffest <= 1; xOffest++) {
    for (let yOffest = -1; yOffest <= 1; yOffest++) {
      const tile = board[x + xOffest]?.[y + yOffest]
      if (tile) tiles.push(tile)
    }
  }
  return tiles
}
