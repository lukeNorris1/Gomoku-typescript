enum STATUS {
    AVAILABLE = 'AVAILABLE',
    UNAVAILABLE = 'UNAVAILABLE',
    WHITE = 'WHITE',
    BLACK = 'BLACK'

}

var turnToggle = true

class Row {
    id: number
    tiles: Tile[]
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
  
    handleClick() {
      if (this.status === STATUS.UNAVAILABLE || 
        this.status === STATUS.BLACK || 
        this.status === STATUS.WHITE) return
      this.element.classList.remove(this.status.toLowerCase())
      if (turnToggle){
        this.status = this.status === STATUS.AVAILABLE || STATUS.BLACK ? STATUS.WHITE : STATUS.AVAILABLE
        turnToggle = !turnToggle
      } else {
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
  
    getSelectedSeatsId() {
    // this.selectedSeats = this.rows.reduce<number[]>((total, row) => {
    //   total = [...total, ...row.selectedSeatsId]
    //   return total
    // }, [])
      this.selectedSeats = this.rows.map((row) => row.selectedTilesId).flat()
      console.log(`selected seats: ${this.selectedSeats.join(',')}`)
    }
  }

var seatMap = new SeatMap(15, 15,)
seatMap.selectedSeats.push(12)
console.log(seatMap.selectedSeats)
document.getElementById('container')?.append(seatMap.element)