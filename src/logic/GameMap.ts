import { GameObject } from './GameObject'
import { Snake } from './Snake'

const COLOR_ODD = '#A2D048' // 奇数格颜色
const COLOR_EVEN = '#AAD751' // 偶数格颜色

/**
 * Map:
 *  - 宽 17 格
 *  - 高 15 格
 */
export class GameMap extends GameObject {
  ctx: CanvasRenderingContext2D
  parentEl: HTMLDivElement
  L: number

  constructor(ctx: CanvasRenderingContext2D, parentEl: HTMLDivElement) {
    super()

    this.ctx = ctx
    this.parentEl = parentEl
    this.L = 0 // 每一格的长度

    // eslint-disable-next-line no-new
    new Snake(this.ctx, this)
  }

  start() {

  }

  update() {
    this.updateSize()
    this.render()
  }

  updateSize() {
    this.L = parseInt(String(Math.min(this.parentEl.clientWidth / 17, this.parentEl.clientHeight / 15)))
    this.ctx.canvas.width = this.L * 17
    this.ctx.canvas.height = this.L * 15
  }

  render() {
    const { L } = this
    for (let i = 0; i < 17; i++) {
      for (let j = 0; j < 15; j++) {
        const color = (i + j) % 2 === 1
          ? COLOR_ODD
          : COLOR_EVEN
        this.ctx.fillStyle = color
        this.ctx.fillRect(L * i, L * j, L, L)
      }
    }
  }
}
