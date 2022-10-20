import { GameObject } from './GameObject'
import { Snake } from './Snake'

const EVEN_COLOR = '#AAD752' // 偶数格颜色
const ODD_COLOR = '#A2D048' // 奇数格颜色

/**
 * Map:
 *  - 宽 17 格
 *  - 高 15 格
 */
export class GameMap extends GameObject {
  ctx: CanvasRenderingContext2D
  parentEl: HTMLDivElement
  L: number // 每格的长度

  constructor(ctx: CanvasRenderingContext2D, parentEl: HTMLDivElement) {
    super()

    this.ctx = ctx
    this.parentEl = parentEl
    this.L = 0

    // eslint-disable-next-line no-new
    new Snake(this.ctx, this)
  }

  start() {

  }

  update() {
    this.updateSize()
    this.render()
  }

  beforeDestory() {

  }

  updateSize() {
    // 向上取整
    this.L = parseInt(String(Math.min(this.parentEl.clientWidth / 17, this.parentEl.clientHeight / 15)))
    this.ctx.canvas.width = this.L * 17
    this.ctx.canvas.height = this.L * 15
  }

  render() {
    for (let i = 0; i < 17; i++) {
      for (let j = 0; j < 15; j++) {
        const c = (i + j) % 2 === 0
          ? EVEN_COLOR
          : ODD_COLOR
        this.ctx.fillStyle = c
        this.ctx.fillRect(this.L * i, this.L * j, this.L, this.L)
      }
    }
  }
}
