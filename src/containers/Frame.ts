import { Transition, transitions } from '@/transitions'

import { Shape } from '@/shapes'
import { Stage } from '@/containers'
import { error } from '@/utils'

export default class Frame {
  /**
   * Stage the frame is attached to.
   *
   * @private
   * @type {Stage}
   * @memberof Shape
   */
  private stage?: Stage

  /**
   * List of shapes.
   *
   * @type {Shape[]}
   * @memberof Shape
   */
  public shapes: Shape[] = []

  /**
   * Background color.
   *
   * @type {string}
   * @memberof Stage
   */
  public background?: string = 'white'

  /**
   * Transition to use.
   *
   * @type {Transition}
   * @memberof Frame
   */
  public transition?: Transition

  /**
   * Creates an instance of Frame.
   *
   * @param {Partial<ShapeOptions>} [options={}]
   * @memberof Shape
   */
  constructor(options: Partial<ShapeOptions> = {}) {
    this.setBackground(options.background).setTransition(options.transition)
  }

  /**
   * Set the stage this frame is attached to.
   *
   * @param {Stage} stage
   * @memberof Shape
   */
  public setStage(stage: Stage) {
    this.stage = stage

    return this
  }

  /**
   * Set the current background.
   *
   * @param {string} [background]
   * @return {Frame}
   * @memberof Frame
   */
  public setBackground(background?: string) {
    this.background = background

    return this
  }

  /**
   * Set the current transition.
   *
   * @param {(string | Transition)} [transition]
   * @return {Frame}
   * @memberof Frame
   */
  public setTransition(transition?: string | Transition) {
    if (typeof transition === 'string') {
      if (!(transition in transitions)) {
        error('The transition you tried to register does not exist.')
      } else {
        transition = transitions[transition]
      }
    }

    this.transition = transition

    return this
  }

  /**
   * Add shapes to the frame.
   *
   * @param {...Shape[]} shapes
   * @return {Frame}
   * @memberof Frame
   */
  public add(...shapes: Shape[]) {
    for (let i = 0; i < shapes.length; i++) {
      this.shapes.push(shapes[i].setFrame(this))
    }

    return this
  }

  /**
   * Remove shapes from the frame.
   *
   * @param {...Shape[]} shapes
   * @return {Frame}
   * @memberof Frame
   */
  public remove(...shapes: Shape[]) {
    for (let i = 0; i < shapes.length; i++) {
      const index = this.shapes.indexOf(shapes[i])
      if (index > -1) {
        this.shapes.slice(index, 1)
      }
    }

    return this
  }

  /**
   * Render the frame.
   *
   * @memberof Frame
   */
  public async render() {
    return new Promise<Frame>(async (resolve) => {
      this.renderBackground()
      await Promise.all(this.shapes.map((shape) => shape.render()))
      resolve(this)
    })
  }

  /**
   * Render the background.
   *
   * @private
   * @memberof Stage
   */
  private renderBackground() {
    if (this.background && this.stage && this.ctx) {
      this.ctx.save()
      this.ctx.fillStyle = this.background
      this.ctx.fillRect(0, 0, this.stage.width, this.stage.height)
      this.ctx.restore()
    }
  }

  /**
   * Get the canvas context.
   *
   * @readonly
   * @memberof Frame
   */
  get ctx() {
    return this.stage?.ctx
  }
}

export interface ShapeOptions {
  id: string | number
  title: string
  transition: string | Transition
  background: string
  shapes: Shape[]
  stage: Stage
}

export const defaultFrame = new Frame({
  id: 1,
  background: 'white',
  title: 'My new Frame',
  transition: 'slide-x',
  shapes: [],
})
