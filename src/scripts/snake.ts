import { Cell } from './cell'
import type { GameMap } from './map'
import { Game } from './game'
import ImageApple from '~/assets/apple.png'

export class Snake extends Game {
  ctx: CanvasRenderingContext2D
  gameMap: GameMap
  cells: Cell[] = []

  color = '#377BB5'
  direction = 1 // 蛇头的方向
  dx: number[] = [0, 1, 0, -1]
  dy: number[] = [-1, 0, 1, 0]
  speed = 7 // 每秒钟走几格
  eps = 1e-1 // 运行的误差

  eyeDx: number[][] = [ // 蛇眼睛横向偏移量
    [-1, 1],
    [1, 1],
    [1, -1],
    [-1, -1],
  ]

  eyeDy: number[][] = [ // 蛇眼睛横向偏移量
    [-1, -1],
    [-1, 1],
    [1, 1],
    [1, -1],
  ]

  appleCell: Cell
  appleImg: HTMLImageElement
  eating = false // 是否吃到苹果
  tailCell: Cell | null = null // 保存下尾部，当吃到苹果时，重新加上尾部，相当于只动头部，否则头尾一起动

  constructor(ctx: CanvasRenderingContext2D, gameMap: GameMap) {
    super()

    this.ctx = ctx
    this.gameMap = gameMap

    this.appleCell = new Cell(-1, -1)
    this.appleImg = new Image()
    this.appleImg.src = ImageApple
  }

  start() {
    // 蛇头需要复制一份
    this.cells.push(new Cell(4, 7))
    for (let i = 4; i >= 1; i--) this.cells.push(new Cell(i, 7))

    if (!this.gameMap.store.restart) this.putAnApple()
  }

  update() {
    if (this.gameMap.status === 'playing') this.updateBody()
    this.render()
  }

  putAnApple() {
    const positions = new Set<string>()
    for (let i = 0; i < 17; i++) {
      for (let j = 0; j < 15; j++)
        positions.add(`${i}-${j}`)
    }

    for (const cell of this.cells) positions.delete(`${cell.c}-${cell.r}`)

    const items: string[] = Array.from(positions)
    if (items.length === 0) { this.gameMap.win() }
    else {
      const [_x, _y] = items[Math.floor(Math.random() * items.length)].split('-')
      const x = parseInt(_x)
      const y = parseInt(_y)
      this.appleCell = new Cell(x, y)
    }
  }

  getTailDirection(a: Cell, b: Cell) {
    const { eps } = this
    if (Math.abs(a.x - b.x) < eps && Math.abs(a.y - b.y) < eps) return -1
    if (Math.abs(a.x - b.x) < eps) {
      if (a.y < b.y) return 2
      return 0
    }
    if (a.x < b.x) return 1
    return 3
  }

  checkDie() {
    const head = this.cells[0]
    if (head.c < 0 || head.c >= 17 || head.r < 0 || head.r >= 15) return true
    for (let i = 2; i < this.cells.length; i++) {
      if (head.c === this.cells[i].c && head.r === this.cells[i].r) return true
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
    } else {
      const newCells: Cell[] = []
      // 重新计算蛇头坐标
      const c = this.cells[1].c + this.dx[this.direction]
      const r = this.cells[1].r + this.dy[this.direction]
      newCells.push(new Cell(c, r))
      newCells.push(new Cell(c, r)) // 复制一份蛇头，用于下一次移动
      for (let i = 1; i < k; i++) newCells.push(this.cells[i])
      // 更新 cells
      this.cells = newCells

      if (this.eating && this.tailCell) {
        this.cells.push(this.tailCell)
        this.eating = false
        this.tailCell = null
      }

      const ds = this.gameMap.directions
      while (ds.length > 0 && (ds[0] === this.direction || ds[0] === (this.direction ^ 2)))
        ds.splice(0, 1)

      if (ds.length > 0) {
        this.direction = ds[0]
        ds.splice(0, 1)
      }

      if (this.checkDie()) this.gameMap.lose()

      // 吃到苹果
      if (this.appleCell.c === c && this.appleCell.r === r) {
        this.eating = true
        const cell = this.cells[this.cells.length - 1]
        this.tailCell = new Cell(cell.c, cell.r) // 需要重新创建，不能直接引用原尾部
        this.putAnApple()
        const score = this.gameMap.store.score + 1
        this.gameMap.store.updateScore(score)
        this.gameMap.store.updateRecord(score)
      }
    }
  }

  render() {
    const { ctx, gameMap: { L }, color, eps } = this

    // 如果吃到苹果，则重新将蛇尾残影添加到 cells 末尾
    if (this.eating && this.tailCell) this.cells.push(this.tailCell)

    // 画苹果
    ctx.drawImage(this.appleImg, this.appleCell.c * L, this.appleCell.r * L, L, L)

    ctx.fillStyle = color
    for (const cell of this.cells) {
      ctx.beginPath()
      ctx.arc(cell.x * L, cell.y * L, L / 2 * 0.8, 0, Math.PI * 2)
      ctx.fill()
    }

    // 连接两格，将身体连起来
    for (let i = 1; i < this.cells.length; i++) {
      const a = this.cells[i - 1]; const b = this.cells[i]
      if (Math.abs(a.x - b.x) < eps && Math.abs(a.y - b.y) < eps) continue

      if (Math.abs(a.x - b.x) < eps) { // 上下
        this.ctx.fillRect((a.x - 0.5 + 0.1) * L, Math.min(a.y, b.y) * L, L * 0.8, Math.abs(a.y - b.y) * L)
      } else { // 左右
        this.ctx.fillRect(Math.min(a.x, b.x) * L, (a.y - 0.5 + 0.1) * L, Math.abs(a.x - b.x) * L, L * 0.8)
      }
    }

    // 画蛇的眼睛
    const head = this.cells[0]
    for (let i = 0; i < 2; i++) {
      const eyeX = (head.x + this.eyeDx[this.direction][i] * 0.18) * L
      const eyeY = (head.y + this.eyeDy[this.direction][i] * 0.18) * L

      // 先画外围椭圆
      ctx.fillStyle = 'white'
      const width = [1, 3].includes(this.direction) ? 0.4 * L : 0.3 * L
      const height = [1, 3].includes(this.direction) ? 0.3 * L : 0.4 * L
      this.drawEllipse(ctx, eyeX - width / 2, eyeY - height / 2, width, height)

      ctx.beginPath()
      ctx.fillStyle = 'black'
      ctx.arc(eyeX, eyeY, L * 0.05, 0, Math.PI * 2)
      ctx.fill()
    }

    // 渲染结束，如果吃到苹果添加了蛇尾残影，需要删除
    if (this.eating && this.tailCell) this.cells.pop()
  }

  /**
   * 画椭圆
   */
  drawEllipse(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    const kappa = 0.5522848
    const ox = (w / 2) * kappa // control point offset horizontal
    const oy = (h / 2) * kappa // control point offset vertical
    const xe = x + w // x-end
    const ye = y + h // y-end
    const xm = x + w / 2 // x-middle
    const ym = y + h / 2 // y-middle

    ctx.beginPath()
    ctx.moveTo(x, ym)
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y)
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym)
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye)
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym)
    ctx.closePath()
    ctx.fill()
  }
}
