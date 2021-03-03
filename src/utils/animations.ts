import { clone, merge } from 'lodash'

export class AnimationManager {
  /**
   * Default options.
   *
   * @private
   * @static
   * @memberof AnimationManager
   */
  private DEFAULT_OPTIONS: AnimationParameters = {
    duration: 1000,
    delay: 0,
    iteration: 1,
    direction: 'normal',
    autoplay: true,
  }

  /**
   * List of animations in stack.
   *
   * @private
   * @memberof AnimationManager
   */
  private stack: ((time: number) => void)[] = []

  /**
   * Creates an instance of AnimationManager.
   *
   * @param {AnimationParameters} [options]
   * @memberof AnimationManager
   */
  constructor(options?: AnimationParameters) {
    if (options !== undefined) {
      this.DEFAULT_OPTIONS = options
    }
  }

  /**
   * Request animation stack.
   *
   * @memberof AnimationManager
   */
  request() {
    requestAnimationFrame((time) => {
      for (let i = 0; i < this.stack.length; i++) {
        this.stack[i](time)
      }

      if (this.stack.length > 0) {
        this.request()
      }
    })
  }

  /**
   * Add to animation stack.
   *
   * @param {(time: number) => void} animation
   * @memberof AnimationManager
   */
  add(animation: (time: number) => void) {
    const hasStarted = this.stack.length > 0

    this.stack.push(animation)

    if (!hasStarted) {
      this.request()
    }
  }

  /**
   * Remove from animation stack.
   *
   * @param {(undefined | ((time: number) => void))} animation
   * @memberof AnimationManager
   */
  remove(animation: undefined | ((time: number) => void)) {
    if (animation === undefined) return

    const index = this.stack.indexOf(animation)

    if (index > -1) {
      this.stack.splice(index, 1)
    }
  }

  /**
   * Animate the given from/to values.
   *
   * @template T
   * @param {(AnimationProps<T> & Partial<AnimationParameters<T>>)} parameters
   * @return {*}
   * @memberof AnimationManager
   */
  animate<T extends AnimationTarget>(
    parameters: AnimationProps<T> & Partial<AnimationParameters<T>>
  ) {
    const options = this.createOptions(parameters)
    const state = this.constructor.createAnimationState(parameters)

    return this.constructor.createPromise(
      this.createStart(state, options),
      this.createStop(state, options),
      state,
      options
    )
  }

  /**
   * Get the progress level depending on start, current and duration time.
   *
   * @private
   * @param {number} start
   * @param {number} time
   * @param {number} duration
   * @return {*}
   * @memberof AnimationManager
   */
  private static getProgress(start: number, time: number, duration: number) {
    return Math.min(1, (time - start) / duration)
  }

  /**
   * Get the value for the given progress level.
   *
   * @private
   * @template T
   * @param {T} from
   * @param {T} to
   * @param {number} progress
   * @return {*}
   * @memberof AnimationManager
   */
  private static getValue<T extends AnimationTarget>(
    from: T,
    to: T,
    progress: number
  ) {
    if (typeof from === 'number' && typeof to === 'number') {
      return (from + (to - from) * progress) as T
    } else if (typeof from === 'string' && typeof to === 'string') {
      const index = Math.floor(to.length * progress) + 1
      return (to.slice(0, index) + from.slice(index)) as T
    } else if (typeof from === 'object' && typeof to === 'object') {
      const newValue = clone(from)
      for (const key in from) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        newValue[key] = this.getValue(from[key], to[key], progress)
      }
      return newValue
    }

    return from
  }

  /**
   * Create an animation value getter.
   *
   * @private
   * @template T
   * @param {AnimationState<T>} state
   * @param {AnimationOptions<T>} options
   * @return {*}
   * @memberof AnimationManager
   */
  private static createValueGetter<T extends AnimationTarget>(
    state: AnimationState<T>,
    options: AnimationOptions<T>
  ) {
    const { direction, to, from } = options
    const reversed =
      direction === 'reverse' ||
      (direction === 'alternate' && !(state.iteration % 2)) ||
      (direction === 'alternate-reverse' && state.iteration % 2)

    if (reversed) {
      return () => this.getValue(to, from, state.progress)
    }

    return () => this.getValue(from, to, state.progress)
  }

  /**
   * Create the animation callback.
   *
   * @private
   * @template T
   * @param {AnimationState<T>} state
   * @param {AnimationOptions<T>} options
   * @param {(state: AnimationState<T>) => void} [resolver]
   * @return {*}
   * @memberof AnimationManager
   */
  private createAnimation<T extends AnimationTarget>(
    state: AnimationState<T>,
    options: AnimationOptions<T>,
    resolver?: (state: AnimationState<T>) => void
  ) {
    let start: number

    const getValue = this.constructor.createValueGetter(state, options)

    return (time: number) => {
      if (start === undefined) {
        start = time
      }

      state.progress = this.constructor.getProgress(
        start,
        time,
        options.duration
      )

      if (state.progress <= 1) {
        state.current = getValue()
        options.onUpdate?.(state)
        state.previous = state.current

        if (state.progress === 1) {
          state.iteration++
          if (options.iteration === state.iteration) {
            this.remove(state.animation)
            options.onFinish?.(state)
            resolver?.(state)
          } else {
            state.animation = this.createAnimation(state, options)
          }
        }
      }
    }
  }

  /**
   * Create the animation starter.
   *
   * @private
   * @template T
   * @param {AnimationState<T>} state
   * @param {AnimationOptions<T>} options
   * @return {*}
   * @memberof AnimationManager
   */
  private createStart<T extends AnimationTarget>(
    state: AnimationState<T>,
    options: AnimationOptions<T>
  ) {
    return (resolver?: (state: AnimationState<T>) => void) => {
      return () => {
        state.animation = this.createAnimation(state, options, resolver)
        this.add(state.animation)
        options.onStart?.(state)
      }
    }
  }

  /**
   * Create the animation stopper.
   *
   * @private
   * @template T
   * @param {AnimationState<T>} state
   * @param {AnimationOptions<T>} options
   * @return {*}
   * @memberof AnimationManager
   */
  private createStop<T extends AnimationTarget>(
    state: AnimationState<T>,
    options: AnimationOptions<T>
  ) {
    return (resolver?: (state: AnimationState<T>) => void) => {
      this.remove(state.animation)
      options.onStop?.(state)
      resolver?.(state)
    }
  }

  /**
   * Create the animation promise.
   *
   * @private
   * @template T
   * @param {(resolver?: (state: AnimationState<T>) => void) => () => void} start
   * @param {ReturnType<typeof createStop>} stop
   * @param {AnimationState<T>} state
   * @param {AnimationOptions<T>} options
   * @return {*}
   * @memberof AnimationManager
   */
  private static createPromise<T extends AnimationTarget>(
    start: (resolver?: (state: AnimationState<T>) => void) => () => void,
    stop: (resolver?: (state: AnimationState<T>) => void) => void,
    state: AnimationState<T>,
    options: AnimationOptions<T>
  ) {
    const promise = new Promise<AnimationState<T>>((resolve) => {
      setTimeout(start(resolve), options.delay)
    }) as AnimationPromise<T>

    promise.state = state
    promise.stop = stop

    return promise
  }

  /**
   * Create the animation base state.
   *
   * @private
   * @template T
   * @param {(AnimationProps<T> & Partial<AnimationParameters<T>>)} options
   * @return {*}  {AnimationState<T>}
   * @memberof AnimationManager
   */
  private static createAnimationState<T extends AnimationTarget>(
    options: AnimationProps<T> & Partial<AnimationParameters<T>>
  ): AnimationState<T> {
    return {
      current: options.from,
      previous: options.from,
      animation: undefined,
      start: undefined,
      stop: undefined,
      progress: 0,
      iteration: 0,
    }
  }

  /**
   * Create the list of options.
   *
   * @private
   * @template T
   * @param {(AnimationProps<T> & Partial<AnimationParameters<T>>)} options
   * @return {*}
   * @memberof AnimationManager
   */
  private createOptions<T extends AnimationTarget>(
    options: AnimationProps<T> & Partial<AnimationParameters<T>>
  ) {
    return merge({}, this.DEFAULT_OPTIONS, options) as AnimationOptions<T>
  }
}

export interface AnimationManager {
  constructor: typeof AnimationManager
}

/**
 * Global animation manager.
 */
export let animationManager: AnimationManager

/**
 * Animate the given from/to values (global).
 *
 * @export
 * @template T
 * @param {(AnimationProps<T> & Partial<AnimationParameters<T>>)} parameters
 * @return {*}
 */
export function animate<T extends AnimationTarget>(
  parameters: AnimationProps<T> & Partial<AnimationParameters<T>>
) {
  if (!animationManager) {
    animationManager = new AnimationManager()
  }

  return animationManager.animate(parameters)
}

/**
 * Create a new AnimationManager instance.
 *
 * @export
 * @param {AnimationParameters} [options]
 * @return {*}
 */
export function createAnimationManager(options?: AnimationParameters) {
  return new AnimationManager(options)
}

type AnimationProps<T extends AnimationTarget = undefined> = {
  from: T
  to: T
}

type AnimationParameters<T extends AnimationTarget = undefined> = {
  duration: number
  delay: number
  iteration: number
  direction: 'alternate' | 'alternate-reverse' | 'normal' | 'reverse'
  autoplay: boolean
  onStart?: (state: AnimationState<T>) => void
  onUpdate?: (state: AnimationState<T>) => void
  onFinish?: (state: AnimationState<T>) => void
  onStop?: (state: AnimationState<T>) => void
}

type AnimationOptions<
  T extends AnimationTarget = undefined
> = AnimationProps<T> & AnimationParameters<T>

type AnimationState<T extends AnimationTarget> = {
  current: T
  previous: T
  progress: number
  iteration: number
  start: undefined | (() => void)
  stop: undefined | (() => void)
  animation: undefined | ((time: number) => void)
}

type AnimationTarget =
  | string
  | undefined
  | number
  | { [key: string]: AnimationTarget }
  | AnimationTarget[]

type AnimationPromise<T extends AnimationTarget = undefined> = Promise<
  AnimationState<T>
> & {
  state: AnimationState<T>
  stop: () => void
}
