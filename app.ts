var turnToggle: Boolean = false
var winConditionMet: Boolean = false
var hiddenTileToggle: Boolean = false
const boardSize: number = 15
var drawConditionCounter: number = boardSize * boardSize

enum STATUS {
  AVAILABLE = 'AVAILABLE',
  WHITE = 'WHITE',
  BLACK = 'BLACK'
}

class Row {
    id: number
    tiles: Tile[]
    element: HTMLDivElement
  
    constructor(id: number, tileNumber: number) {
      this.id = id
      this.tiles = Array.from({ length: tileNumber }).map((_, index) => {
        const tileId = tileNumber * id + index
        return new Tile(tileId)
      })
      this.element = document.createElement('div')
      this.element.classList.add('row')
      this.element.append(...this.tiles.map((tile) => tile.element))
    }
  
    get selectedTilesId() {
      return this.tiles.filter((tile) => tile.isSelected).map((tile) => tile.id)
    }
  }

class Tile {
    id: number
    status: STATUS
    element: HTMLDivElement
  
    constructor(id: number) {
      this.id = id
      this.status = STATUS.AVAILABLE
      this.element = document.createElement('div')
      this.element.classList.add('tile')
      this.element.classList.add(this.status.toLowerCase())
      this.element.addEventListener('click', () => {
        this.handleClick()
      })
    }

    resetStatus(){
      this.element.classList.remove(STATUS.BLACK.toLowerCase())
      this.element.classList.remove(STATUS.WHITE.toLowerCase())
      this.status = STATUS.AVAILABLE
      this.element.classList.add(STATUS.AVAILABLE.toLowerCase())
    }
  
    handleClick() {
      if (!winConditionMet){
        if (this.status === STATUS.BLACK || 
          this.status === STATUS.WHITE) return
        this.element.classList.remove(this.status.toLowerCase())
        if (hiddenTileToggle) tileMap.hideRandomTile()
        if (turnToggle){
          turnOrderText.innerText = "Current player: black"
          this.status = this.status === STATUS.AVAILABLE || STATUS.BLACK ? STATUS.WHITE : STATUS.AVAILABLE
          turnToggle = !turnToggle
        } else {
          turnOrderText.innerText = "Current player: white"
          this.status = this.status === STATUS.AVAILABLE || STATUS.WHITE ? STATUS.BLACK : STATUS.AVAILABLE
          turnToggle = !turnToggle
        }
        if (won('white')){
          turnOrderText.innerText = "White Won!"
          winConditionMet = true
        }
        else if (won('black')){
          turnOrderText.innerText = "Black Won!"
          winConditionMet = true
        }
        this.element.classList.add(this.status.toLowerCase())
      }
    }
  
    get isSelected() {
      return this.status === STATUS.BLACK || this.status === STATUS.WHITE
    }
  }

  class TileMap {
    rows: Row[]
    selectedTiles: number[] = []
    element: HTMLDivElement

    constructor(
      rowNumber: number,
      tileNumberPerRow: number
    ) {
      this.rows = Array.from({ length: rowNumber }).map((_, index) => {
        return new Row(index, tileNumberPerRow)
      })
      this.element = document.createElement('div')
      this.element.classList.add('board-container')
      this.element.append(...this.rows.map((row) => row.element))
      this.element.addEventListener('click', () => {
        this.getSelectedTilesId()
      })
    }

    hideRandomTile(){
      var tempTile = this.rows[Math.floor(Math.random() * boardSize)].tiles[Math.floor(Math.random() * boardSize)]
      if (tempTile.element.style.visibility == "hidden") this.hideRandomTile()
      tempTile.element.style.visibility = "hidden"
      tempTile.status = STATUS.AVAILABLE
      drawConditionCounter -= 1
      console.log('drawCondCounter: ' + drawConditionCounter)
    }

    getSelectedTilesId() {
      this.selectedTiles = this.rows.map((row) => row.selectedTilesId).flat()
      if (tileMap.selectedTiles.length == drawConditionCounter) turnOrderText.innerText = "DRAW"
    }
  }

// Creating the game board
var tileMap = new TileMap(boardSize, boardSize)
var resetButton = document.createElement('div')
var turnOrderText = document.createElement('div')
var buttonHiddenToggle = document.createElement('div')
document.getElementById('container')?.append(tileMap.element)

//Adding hidden toggle button for additional feature
buttonHiddenToggle.innerText = "Hard Difficulty"
document.getElementById('hideTile-container')?.append(buttonHiddenToggle)

//Adding the reset button
resetButton.classList.add('reset')
resetButton.innerText = "RESET"
document.getElementById('reset-container')?.append(resetButton)

resetButton.addEventListener('click', () => {
  tileMap.rows.map((row) => row.tiles.map((tile) => tile.resetStatus()))
  tileMap.rows.map((row) => row.tiles.map((tile) => tile.element.style.visibility = 'visible'))
  tileMap.selectedTiles.splice(0)
  turnOrderText.innerText = "Current player: black"
  turnToggle = false
  winConditionMet = false
})

buttonHiddenToggle.addEventListener('click', () => {
  hiddenTileToggle = !hiddenTileToggle
  if (hiddenTileToggle) buttonHiddenToggle.style.color = 'lightgreen'
  else buttonHiddenToggle.style.color = '#FFFFFF'
})

//Changing the turn order for the player
turnOrderText.classList.add('turnOrder')
turnOrderText.innerText = "Current player: black"
document.getElementById('turn-order')?.append(turnOrderText)



function won(inputStatus: string)
{
  //check each row: #Horizontal
  var match: boolean = true;
  for (let i = 0; i < tileMap.rows.length; i++){
    for (let j = 2; j < tileMap.rows[i].tiles.length - 2; j++){
      if (tileMap.rows[i].tiles[j].status.toLowerCase() == inputStatus &&
        tileMap.rows[i].tiles[j - 2].status.toLowerCase() == inputStatus &&
        tileMap.rows[i].tiles[j - 1].status.toLowerCase() == inputStatus &&
        tileMap.rows[i].tiles[j + 1].status.toLowerCase() == inputStatus &&
        tileMap.rows[i].tiles[j + 2].status.toLowerCase() == inputStatus)
          return true
    }
  }
  // Check for each column: #Vertical
  for (let i = 2; i < tileMap.rows.length - 2; i++){
    for (let j = 0; j < tileMap.rows[i].tiles.length; j++){
      if (tileMap.rows[i].tiles[j].status.toLowerCase() == inputStatus &&
      tileMap.rows[i - 2].tiles[j].status.toLowerCase() == inputStatus &&
      tileMap.rows[i - 1].tiles[j].status.toLowerCase() == inputStatus &&
      tileMap.rows[i + 1].tiles[j].status.toLowerCase() == inputStatus &&
      tileMap.rows[i + 2].tiles[j].status.toLowerCase() == inputStatus)
      return true
  }
}  
  // Check for Diagonal - Top-left to Bottom-Right
  for (let i = 2; i < tileMap.rows.length - 2; i++){
    for (let j = 2; j < tileMap.rows[i].tiles.length - 2; j++){
      if (tileMap.rows[i].tiles[j].status.toLowerCase() == inputStatus &&
      tileMap.rows[i - 2].tiles[j - 2].status.toLowerCase() == inputStatus &&
      tileMap.rows[i - 1].tiles[j - 1].status.toLowerCase() == inputStatus &&
      tileMap.rows[i + 1].tiles[j + 1].status.toLowerCase() == inputStatus &&
      tileMap.rows[i + 2].tiles[j + 2].status.toLowerCase() == inputStatus)
        return true
    }
  }

// Check for Diagonal - Top-right to Bottom-Left
for (let i = 2; i < tileMap.rows.length - 2; i++){
  for (let j = 2; j < tileMap.rows[i].tiles.length - 2; j++){
    if (tileMap.rows[i].tiles[j].status.toLowerCase() == inputStatus &&
    tileMap.rows[i - 2].tiles[j + 2].status.toLowerCase() == inputStatus &&
    tileMap.rows[i - 1].tiles[j + 1].status.toLowerCase() == inputStatus &&
    tileMap.rows[i + 1].tiles[j - 1].status.toLowerCase() == inputStatus &&
    tileMap.rows[i + 2].tiles[j - 2].status.toLowerCase() == inputStatus)
      return true
  }
}
    return false;
}


