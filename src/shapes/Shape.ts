import { Frame } from '@/containers'

export default class Shape {
  /**
   * Frame the shape is attached to.
   *
   * @private
   * @type {Frame}
   * @memberof Shape
   */
  private frame?: Frame

  /**
   * Creates an instance of Shape.
   *
   * @param {Partial<ShapeOptions>} [options={}]
   * @memberof Shape
   */
  constructor(options: Partial<ShapeOptions> = {}) {
    console.log(options)
  }

  /**
   * Set the frame this shape is attached to.
   *
   * @param {Frame} frame
   * @memberof Shape
   */
  public setFrame(frame: Frame) {
    this.frame = frame

    return this
  }

  /**
   * Render the shape.
   *
   * @memberof Shape
   */
  public async render() {
    return new Promise<Shape>(async (resolve) => {
      resolve(this)
    })
  }
}

export interface ShapeOptions {
  id: string
  frame: Frame
}
