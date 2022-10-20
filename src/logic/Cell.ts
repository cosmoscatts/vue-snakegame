export class Cell {
  c: number
  r: number
  x: number
  y: number

  constructor(c: number, r: number) {
    this.c = c
    this.r = r
    this.x = c + 0.5
    this.y = r + 0.5
  }
}
