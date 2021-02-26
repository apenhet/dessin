import { Frame, defaultFrame } from '@/containers'
import { error, isElement } from '@/utils'

import { Transition } from '@/transitions'
import { capitalize } from 'lodash'

export default class Stage {
  /**
   * Container.
   *
   * @type {HTMLCanvasElement}
   * @memberof Stage
   */
  public canvas!: HTMLCanvasElement

  /**
   * Container width.
   *
   * @memberof Stage
   */
  public width = 0

  /**
   * Container height.
   *
   * @memberof Stage
   */
  public height = 0

  /**
   * List of frames.
   *
   * @type {Frame[]}
   * @memberof Stage
   */
  public frames: Frame[] = []

  /**
   * Current frame index.
   *
   * @type {number}
   * @memberof Stage
   */
  public currentFrameIndex = 0

  /**
   * Background color.
   *
   * @type {string}
   * @memberof Stage
   */
  public background?: string = 'white'

  /**
   * Whether the stage is being rendered.
   *
   * @private
   * @type {boolean}
   * @memberof Stage
   */
  private rendering = false

  /**
   * Creates an instance of Stage.
   *
   * @param {string|HTMLCanvasElement} canvas
   * @param {Partial<StageOptions>} [options={}]
   * @memberof Stage
   */
  constructor(
    canvas: string | HTMLCanvasElement,
    options: Partial<StageOptions> = {}
  ) {
    this.setCanvas(canvas)
      .setDimensions(options)
      .setPixelRatio(options.pixelRatio)
      .setBackground(options.background)
      .add(...(options.frames ?? [defaultFrame]))
      .registerEvents()
      .render()
  }

  /**
   * Set the container dimensions.
   *
   * @param {Partial<StageOptions>} { width, height }
   * @return {Stage}
   * @memberof Stage
   */
  public setDimensions({ width, height }: Partial<StageOptions>) {
    this.width = width ?? this.canvas.width
    this.height = height ?? this.canvas.height
    this.canvas.style.width = this.width + 'px'
    this.canvas.style.height = this.height + 'px'

    return this
  }

  /**
   * Set container pixel ratio.
   *
   * @param {number} [pixelRatio=window.devicePixelRatio]
   * @return {Stage}
   * @memberof Stage
   */
  public setPixelRatio(pixelRatio: number = window.devicePixelRatio) {
    const width = this.width * pixelRatio
    const height = this.height * pixelRatio
    this.canvas.width = width
    this.canvas.height = height
    this.ctx.scale(pixelRatio, pixelRatio)

    return this
  }

  /**
   * Set the canvas container element.
   *
   * @param {(string | HTMLCanvasElement)} canvas
   * @return {Stage}
   * @throws {Error}
   * @memberof Stage
   */
  public setCanvas(canvas: string | HTMLCanvasElement) {
    const element =
      typeof canvas === 'string' ? document.querySelector(canvas) : canvas
    this.canvas = isElement(element, HTMLCanvasElement)

    return this
  }

  /**
   * Set the current background.
   *
   * @param {string} [background]
   * @return {Stage}
   * @memberof Stage
   */
  public setBackground(background?: string) {
    this.background = background

    return this
  }

  /**
   * Register the conttainer events.
   *
   * @private
   * @return {Stage}
   * @memberof Stage
   */
  private registerEvents() {
    return this.on('mousedown').on('mousemove').on('mouseup').on('dblclick')
  }

  /**
   * Listen to the given event. If a callback is passed,
   * the event name can be anything, if no callback is passed
   * a local method must be available.
   *
   * @private
   * @param {EventNames<Stage>|string} eventName
   * @param {(event: Event) => void} [callback]
   * @return {Stage}
   * @memberof Stage
   */
  private on(
    eventName: Extract<EventNames<Stage>, keyof HTMLElementEventMap>
  ): Stage
  private on<K extends keyof HTMLElementEventMap>(
    eventName: K,
    callback: (event: HTMLElementEventMap[K]) => void
  ): Stage
  private on<K extends keyof HTMLElementEventMap>(
    eventName: K,
    callback?: (event: HTMLElementEventMap[K]) => void
  ) {
    const name = `on${capitalize(eventName)}` as Extract<
      keyof HTMLElementEventMap,
      EventMethodNames<Stage>
    >

    callback ??= this[name]

    this.canvas.addEventListener(eventName, (event: HTMLElementEventMap[K]) => {
      if (callback) {
        callback(event)
      }
    })

    return this
  }

  public onMousedown(event: MouseEvent) {
    if (event.detail === 1) {
      console.log('mousedown')
    }
  }

  public onMousemove(_event: MouseEvent) {
    console.log('mousemove')
  }

  public onMouseup(_event: MouseEvent) {
    console.log('mouseup')
  }

  public onDblclick(_event: MouseEvent) {
    console.log('dblclick')
  }

  /**
   * Add frames to the stage.
   *
   * @param {...Frame[]} frames
   * @return {Stage}
   * @memberof Stage
   */
  public add(...frames: Frame[]) {
    for (let i = 0; i < frames.length; i++) {
      this.frames.push(frames[i].setStage(this))
    }

    return this
  }

  /**
   * Remove frames from the stage.
   *
   * @param {...Frame[]} frames
   * @return {Stage}
   * @memberof Stage
   */
  public remove(...frames: Frame[]) {
    for (let i = 0; i < frames.length; i++) {
      const index = this.frames.indexOf(frames[i])
      if (index > -1) {
        this.frames.slice(index, 1)
      }
    }

    return this
  }

  /**
   * Clear the entire stage.
   *
   * @memberof Stage
   */
  public clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  /**
   * Render the current frame on stage.
   *
   * @return {Stage}
   * @memberof Stage
   */
  public async render() {
    if (this.rendering) return

    return await this.forceRender()
  }

  /**
   * Force the rendering of the stage.
   *
   * @return {Promise<Stage>}
   * @memberof Stage
   */
  public async forceRender() {
    return new Promise<Stage>(async (resolve) => {
      if (this.currentFrame) {
        this.rendering = true
        this.clear()
        this.renderBackground()
        await this.currentFrame.render()
        this.rendering = false
      }
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
    if (this.background) {
      this.ctx.save()
      this.ctx.fillStyle = this.background
      this.ctx.fillRect(0, 0, this.width, this.height)
      this.ctx.restore()
    }
  }

  /**
   * Go to the next frame.
   *
   * @return {Stage}
   * @memberof Stage
   */
  public async next() {
    if (this.canGoNext) {
      await this.goTo(this.currentFrameIndex + 1)
    }

    return this
  }

  /**
   * Go to the previous frame.
   *
   * @return {Stage}
   * @memberof Stage
   */
  public async previous() {
    if (this.canGoPrevious) {
      await this.goTo(this.currentFrameIndex - 1)
    }

    return this
  }

  /**
   * Go to the given frame or frame index.
   *
   * @param {(Frame|number)} frame
   * @return {Stage}
   * @memberof Stage
   */
  public async goTo(frame: Frame | number) {
    if (frame instanceof Frame) {
      frame = this.frames.indexOf(frame)
    }
    if (this.frames[frame]) {
      this.currentFrameIndex = frame
      await this.render()
    }

    return this
  }

  /**
   * Get the canvas 2D rendering context.
   *
   * @readonly
   * @memberof Stage
   */
  get ctx() {
    const ctx = this.canvas.getContext('2d')
    if (!ctx) {
      error('Not able to get the canvas 2D Context.')
    }
    return ctx
  }

  /**
   * Whether the stage can go to the next frame.
   *
   * @readonly
   * @memberof Stage
   */
  get canGoNext() {
    return this.currentFrameIndex < this.frames.length - 1
  }

  /**
   * Whether the stage can go to the previous frame.
   *
   * @readonly
   * @memberof Stage
   */
  get canGoPrevious() {
    return this.currentFrameIndex > 0
  }

  /**
   * Current frame.
   *
   * @readonly
   * @memberof Stage
   */
  get currentFrame() {
    return this.frames[this.currentFrameIndex]
  }
}

export interface StageDimensions {
  width: number
  height: number
}

export interface StageOptions extends StageDimensions {
  id: string | number
  title: string
  transition: keyof Window['dessin']['utils']['transitions'] | Transition
  background: string
  pixelRatio: number
  frames: Frame[]
}
