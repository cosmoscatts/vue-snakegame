const GAME_OBJECTS: GameObject[] = []

export class GameObject {
  timeDelta: number
  hasCalledStart: boolean

  constructor() {
    this.timeDelta = 0
    this.hasCalledStart = false
    GAME_OBJECTS.push(this)
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
      const obj = GAME_OBJECTS[i]
      if (obj === this) {
        GAME_OBJECTS.splice(parseInt(i), 1)
        break
      }
    }
  }
}

let lastTimeStamp = 0

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
      game.timeDelta = timestamp - lastTimeStamp
      game.update()
    }
  }
  lastTimeStamp = timestamp
  requestAnimationFrame(step)
}

requestAnimationFrame(step)
