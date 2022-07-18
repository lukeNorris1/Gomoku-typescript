var turnToggle: Boolean = false
const boardSize: number = 3

enum STATUS {
  AVAILABLE = 'AVAILABLE',
  UNAVAILABLE = 'UNAVAILABLE',
  WHITE = 'WHITE',
  BLACK = 'BLACK'

}

class Row {
    id: number
    tiles: Tile[]
    whiteTiles: Tile[]
    blackTiles: Tile[]
    element: HTMLDivElement
  
    constructor(id: number, seatNumber: number, occupiedSeats: number[] = []) {
      this.id = id
      this.tiles = Array.from({ length: seatNumber }).map((_, index) => {
        const seatId = seatNumber * id + index
        return new Tile(seatId)
      })
      this.element = document.createElement('div')
      this.element.classList.add('row')
      this.element.append(...this.tiles.map((seat) => seat.element))
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
      if (this.status === STATUS.UNAVAILABLE || 
        this.status === STATUS.BLACK || 
        this.status === STATUS.WHITE) return
      this.element.classList.remove(this.status.toLowerCase())
      if (turnToggle){
        turnOrderText.innerText = "Current player: black"
        this.status = this.status === STATUS.AVAILABLE || STATUS.BLACK ? STATUS.WHITE : STATUS.AVAILABLE
        turnToggle = !turnToggle
      } else {
        turnOrderText.innerText = "Current player: white"
        this.status = this.status === STATUS.AVAILABLE || STATUS.WHITE ? STATUS.BLACK : STATUS.AVAILABLE
        turnToggle = !turnToggle
      }
      this.element.classList.add(this.status.toLowerCase())
    }
  
    get isSelected() {
      return this.status === STATUS.BLACK || this.status === STATUS.WHITE
    }
  }

  class SeatMap {
    rows: Row[]
    selectedSeats: number[] = []
    element: HTMLDivElement
    constructor(
      rowNumber: number,
      seatNumberPerRow: number,
      occupiedSeats: number[] = []
    ) {
      this.rows = Array.from({ length: rowNumber }).map((_, index) => {
        return new Row(index, seatNumberPerRow, occupiedSeats)
      })
      this.element = document.createElement('div')
      this.element.classList.add('board-container')
      this.element.append(...this.rows.map((row) => row.element))
      this.element.addEventListener('click', () => {
        this.getSelectedSeatsId()
      })
    }

    resetSelectedSeats(){
      this.selectedSeats.splice(0)
    }
    getSelectedSeatsId() {
      this.selectedSeats = this.rows.map((row) => row.selectedTilesId).flat()
      console.log(`selected seats: ${this.selectedSeats.join(',')}`)
      if (seatMap.selectedSeats.length == boardSize * boardSize) turnOrderText.innerText = "DRAW"
    }
  }

// Creating the game board
var seatMap = new SeatMap(boardSize, boardSize)
var resetButton = document.createElement('div')
var turnOrderText = document.createElement('div')

function fullBoard(){
  for (let i = 0; i < seatMap.rows.length; i++){
    for (let j = 0; j < seatMap.rows[i].tiles.length; j++){
      if (seatMap.rows[i].tiles[j].status != STATUS.BLACK || 
        seatMap.rows[i].tiles[j].status != STATUS.WHITE) {
        console.log("Trigger 2")
        return true
      }
      console.log(seatMap.rows[i].tiles[j])
    }
  }
}


document.getElementById('container')?.append(seatMap.element)

//Adding the reset button
resetButton.classList.add('reset')
resetButton.innerText = "RESET"
document.getElementById('reset-container')?.append(resetButton)

resetButton.addEventListener('click', () => {
  seatMap.rows.map((row) => row.tiles.map((tile) => tile.resetStatus()))
  seatMap.resetSelectedSeats()
  turnOrderText.innerText = "Current player: black"
  turnToggle = false
})

//Changing the turn order for the player
turnOrderText.classList.add('turnOrder')
turnOrderText.innerText = "Current player: black"
document.getElementById('turn-order')?.append(turnOrderText)