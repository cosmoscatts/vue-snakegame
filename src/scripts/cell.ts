export class Cell {
  x: number
  y: number

  constructor(public c: number, public r: number) {
    this.c = c
    this.r = r
    this.x = c + 0.5
    this.y = r + 0.5
  }
}
