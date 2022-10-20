import { Cell, type GameMap, GameObject } from '.'

export class Snake extends GameObject {
  ctx: CanvasRenderingContext2D
  gameMap: GameMap
  cells: Cell[]

  constructor(ctx: CanvasRenderingContext2D, gameMap: GameMap) {
    super()

    this.ctx = ctx
    this.gameMap = gameMap
    this.cells = []
  }

  start() {
    for (let i = 1; i <= 4; i++)
      this.cells.push(new Cell(i, 7))
  }

  update() {
    this.render()
  }

  render() {
    const { gameMap: { L }, ctx } = this
    ctx.fillStyle = '#377BB5'
    for (const cell of this.cells) {
      ctx.beginPath()
      ctx.arc(cell.x * L, cell.y * L, L / 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}
