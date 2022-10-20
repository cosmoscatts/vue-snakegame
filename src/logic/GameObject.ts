const GAME_OBJECTS: GameObject[] = []

export class GameObject {
  timeDelta: number
  hasCalledStart: boolean

  constructor() {
    GAME_OBJECTS.push(this)
    this.timeDelta = 0
    this.hasCalledStart = false
  }

  start() {

  }

  update() {

  }

  beforeDestory() {

  }

  destory() {
    this.beforeDestory()

    for (const i in GAME_OBJECTS) {
      const game = GAME_OBJECTS[i]
      if (game === this) {
        GAME_OBJECTS.splice(Number(i), 1)
        break
      }
    }
  }
}

// 上次执行时间
let lastTimestamp = 0

/**
 * 每一帧执行函数
 */
const step = (timestamp: number) => {
  for (const game of GAME_OBJECTS) {
    if (!game.hasCalledStart) {
      game.start()
      game.hasCalledStart = true
    }
    else {
      game.timeDelta = timestamp - lastTimestamp
      game.update()
    }
  }

  lastTimestamp = timestamp
  requestAnimationFrame(step)
}

requestAnimationFrame(step)
