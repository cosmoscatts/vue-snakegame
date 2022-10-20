import { Cell, type GameMap, GameObject } from '.'

export class Snake extends GameObject {
  ctx: CanvasRenderingContext2D
  gameMap: GameMap
  cells: Cell[]

  speed: number // 每秒走的格数
  dx: number[]
  dy: number[]
  direction: number // 蛇头方向

  eps: number // 允许的误差

  constructor(ctx: CanvasRenderingContext2D, gameMap: GameMap) {
    super()

    this.ctx = ctx
    this.gameMap = gameMap
    this.cells = []

    this.speed = 1
    this.dx = [0, 1, 0, -1]
    this.dy = [-1, 0, 1, 0]
    this.direction = 1

    this.eps = 1e-2
  }

  start() {
    // 蛇头需要复制一份
    this.cells.push(new Cell(4, 7))
    for (let i = 4; i >= 1; i--)
      this.cells.push(new Cell(i, 7))
  }

  update() {
    this.updateBody()
    this.render()
  }

  getTailDirection(a: Cell, b: Cell) {
    const { eps } = this
    if (Math.abs(a.x - b.x) < eps && Math.abs(a.y - b.y) < eps)
      return -1
    if (Math.abs(a.x - b.x) < eps) {
      if (a.y < b.y)
        return 0
      return 2
    }
    return a.x < a.y
      ? 1
      : 3
  }

  updateBody() {
    const k = this.cells.length - 1
    const d = this.getTailDirection(this.cells[k], this.cells[k - 1])
    if (d >= 0) {
      const distance = this.speed * this.timeDelta / 1000
      this.cells[k].x += this.dx[d] * distance
      this.cells[k].y += this.dy[d] * distance
      this.cells[0].x += this.dx[this.direction] * distance
      this.cells[0].y += this.dy[this.direction] * distance
    }
    else {
      const newCells: Cell[] = []
      // 重新计算蛇头坐标
      const c = this.cells[1].c + this.dx[this.direction]
      const r = this.cells[1].r + this.dy[this.direction]
      newCells.push(new Cell(c, r))
      newCells.push(new Cell(c, r))
      for (let i = 1; i < k; i++)
        newCells.push(this.cells[i])

      this.cells = newCells
    }
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
