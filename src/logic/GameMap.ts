import { type Store } from 'pinia'
import { type Ref } from 'vue'
import { GameObject } from './GameObject'
import { Snake } from './Snake'

const COLOR_ODD = '#A2D048' // 奇数格颜色
const COLOR_EVEN = '#AAD751' // 偶数格颜色

interface T {
  score: Ref<number>
  record: Ref<number>
  restart: Ref<boolean>
  updateScore: (_score: number) => number
  updateRecord: (_record: number) => number
  updateRestart: (_restart: boolean) => boolean
}

/**
 * Map:
 *  - 宽 17 格
 *  - 高 15 格
 */
export class GameMap extends GameObject {
  ctx: CanvasRenderingContext2D
  parentEl: HTMLDivElement
  store: Store<'store', T>
  L: number
  directions: number[]
  status: 'waiting' | 'playing' | 'win' | 'lose'
  snake: Snake

  constructor(ctx: CanvasRenderingContext2D, parentEl: HTMLDivElement, store: Store<'store', T>) {
    super()

    this.ctx = ctx
    this.parentEl = parentEl
    this.store = store
    this.L = 0 // 每一格的长度
    this.directions = [] // 存储用户的操作
    this.status = 'waiting' // 当前状态
    this.snake = new Snake(this.ctx, this)
  }

  start() {
    this.ctx.canvas.focus()

    this.ctx.canvas.addEventListener('keydown', (e) => {
      if (this.store.restart)
        return false

      if (e.key === 'w' || e.key === 'ArrowUp') {
        this.directions.push(0)
        e.preventDefault()
      }
      else if (e.key === 'd' || e.key === 'ArrowRight') {
        this.directions.push(1)
        e.preventDefault()
      }
      else if (e.key === 's' || e.key === 'ArrowDown') {
        this.directions.push(2)
        e.preventDefault()
      }
      else if (e.key === 'a' || e.key === 'ArrowLeft') {
        this.directions.push(3)
        e.preventDefault()
      }

      const k = this.directions.length
      if (k > 1 && this.directions[k - 1] === this.directions[k - 2])
        this.directions.pop()

      while (this.directions.length > 2)
        this.directions.splice(0, 1)

      // 第一次操作时，设置开始游戏状态
      if (this.status === 'waiting' && this.directions.length && this.directions[0] !== 3) {
        this.status = 'playing'
        this.snake.direction = this.directions[0]
      }
    })
  }

  update() {
    this.updateSize()
    this.render()
  }

  win() {
    this.snake.color = 'white'
    this.status = 'win'
    this.store.updateRestart(true)
    alert('you win!')
  }

  lose() {
    this.snake.color = 'white'
    this.status = 'lose'
    this.store.updateRestart(true)
    alert('you lose!')
  }

  restart() {
    this.store.updateScore(0)
    this.status = 'waiting'
    this.store.updateRestart(false)
    this.snake.destory()
    this.snake = new Snake(this.ctx, this)
    this.ctx.canvas.focus()
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
