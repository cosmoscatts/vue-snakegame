import { Cell } from './Cell'
import type { GameMap } from './GameMap'
import { GameObject } from './GameObject'

export class Snake extends GameObject {
  ctx: CanvasRenderingContext2D
  gameMap: GameMap
  cells: Cell[]

  color: string
  direction: number
  dx: number[]
  dy: number[]
  speed: number
  eps: number

  constructor(ctx: CanvasRenderingContext2D, gameMap: GameMap) {
    super()

    this.ctx = ctx
    this.gameMap = gameMap
    this.cells = []

    this.color = '#377BB5'
    this.direction = 1 // 蛇头的方向
    this.dx = [0, 1, 0, -1]
    this.dy = [-1, 0, 1, 0]
    this.speed = 8 // 每秒钟走几格
    this.eps = 1e-1 // 运行的误差
  }

  start() {
    // 蛇头需要复制一份
    this.cells.push(new Cell(4, 7))
    for (let i = 4; i >= 1; i--)
      this.cells.push(new Cell(i, 7))
  }

  update() {
    if (this.gameMap.status === 'playing')
      this.updateBody()
    this.render()
  }

  getTailDirection(a: Cell, b: Cell) {
    const { eps } = this
    if (Math.abs(a.x - b.x) < eps && Math.abs(a.y - b.y) < eps)
      return -1
    if (Math.abs(a.x - b.x) < eps) {
      if (a.y < b.y)
        return 2
      return 0
    }
    if (a.x < b.x)
      return 1
    return 3
  }

  checkDie() {
    const head = this.cells[0]
    if (head.c < 0 || head.c >= 17 || head.r < 0 || head.r >= 15)
      return true

    for (let i = 2; i < this.cells.length; i++) {
      if (head.c === this.cells[i].c && head.r === this.cells[i].r)
        return true
    }

    return false
  }

  updateBody() {
    const k = this.cells.length - 1
    const d = this.getTailDirection(this.cells[k], this.cells[k - 1])
    if (d >= 0) {
      const distance = this.speed * this.timeDelta / 1000
      this.cells[k].x += distance * this.dx[d]
      this.cells[k].y += distance * this.dy[d]
      this.cells[0].x += distance * this.dx[this.direction]
      this.cells[0].y += distance * this.dy[this.direction]
    }
    else {
      const newCells: Cell[] = []
      // 重新计算蛇头坐标
      const c = this.cells[1].c + this.dx[this.direction]
      const r = this.cells[1].r + this.dy[this.direction]
      newCells.push(new Cell(c, r))
      newCells.push(new Cell(c, r)) // 复制一份蛇头，用于下一次移动
      for (let i = 1; i < k; i++)
        newCells.push(this.cells[i])
      // 更新 cells
      this.cells = newCells

      const ds = this.gameMap.directions
      while (ds.length > 0 && (ds[0] === this.direction || ds[0] === (this.direction ^ 2)))
        ds.splice(0, 1)

      if (ds.length > 0) {
        this.direction = ds[0]
        ds.splice(0, 1)
      }

      if (this.checkDie())
        this.gameMap.lose()
    }
  }

  render() {
    const { ctx, gameMap: { L }, color, eps } = this
    ctx.fillStyle = color
    for (const cell of this.cells) {
      ctx.beginPath()
      ctx.arc(cell.x * L, cell.y * L, L / 2 * 0.8, 0, Math.PI * 2)
      ctx.fill()
    }

    // 连接两格，将身体连起来
    for (let i = 1; i < this.cells.length; i++) {
      const a = this.cells[i - 1]; const b = this.cells[i]
      if (Math.abs(a.x - b.x) < eps && Math.abs(a.y - b.y) < eps)
        continue

      if (Math.abs(a.x - b.x) < eps) { // 上下
        this.ctx.fillRect((a.x - 0.5 + 0.1) * L, Math.min(a.y, b.y) * L, L * 0.8, Math.abs(a.y - b.y) * L)
      }
      else { // 左右
        this.ctx.fillRect(Math.min(a.x, b.x) * L, (a.y - 0.5 + 0.1) * L, Math.abs(a.x - b.x) * L, L * 0.8)
      }
    }
  }
}
