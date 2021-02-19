import { computed } from '@/utils/decorators'
import { isElement } from '@/utils/dom'

export default class Stage {
    /**
     * Container.
     *
     * @type {HTMLCanvasElement}
     * @memberof Stage
     */
    public canvas?: HTMLCanvasElement

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
     * Creates an instance of Stage.
     *
     * @param {string|HTMLCanvasElement} canvas
     * @param {Partial<StageOptions>} [options={}]
     * @memberof Stage
     */
    constructor(canvas: string | HTMLCanvasElement, options: Partial<StageOptions> = {}) {
        this.setCanvas(canvas).setDimensions(options).setPixelRatio(options.pixelRatio)
    }

    /**
     * Set the container dimensions.
     *
     * @param {Partial<StageOptions>} { width, height }
     * @return {Stage}
     * @memberof Stage
     */
    public setDimensions({ width, height }: Partial<StageOptions>) {
        if (this.canvas) {
            this.width = width ?? this.canvas.width
            this.height = height ?? this.canvas.height
            this.canvas.style.width = this.width + 'px'
            this.canvas.style.height = this.height + 'px'
        }

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
        if (this.canvas) {
            const width = this.width * pixelRatio
            const height = this.height * pixelRatio
            this.canvas.width = width
            this.canvas.height = height
            const ctx = this.canvas.getContext('2d')
            ctx?.scale(pixelRatio, pixelRatio)
        }

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
        const element = typeof canvas === 'string' ? document.querySelector(canvas) : canvas

        this.canvas = isElement(element, HTMLCanvasElement)

        return this
    }

    /**
     * Offset X of the container.
     *
     * @readonly
     * @memberof Stage
     */
    @computed
    get offsetX() {
        return this.canvas?.getBoundingClientRect().left
    }

    /**
     * Offset Y of the container.
     *
     * @readonly
     * @memberof Stage
     */
    @computed
    get offsetY() {
        return this.canvas?.getBoundingClientRect().top
    }
}

export interface StageDimensions {
    width: number
    height: number
}

export interface StageOptions extends StageDimensions {
    pixelRatio: number
}