/* eslint-disable @typescript-eslint/no-explicit-any */
import { Frame, Stage } from '@/index'

import { dispatch } from './utils/helpers'
import { watcher } from '@/utils'

describe('Stage', () => {
  it('should create a new Stage instance', () => {
    const instance = new Stage(document.createElement('canvas'))
    expect(instance).toBeInstanceOf(Stage)
  })

  it("should throw an error if element isn't canvas", () => {
    const element = (document.createElement(
      'p'
    ) as unknown) as HTMLCanvasElement
    expect(() => new Stage(element)).toThrow()
    expect(() => new Stage('p')).toThrow()
  })

  it('should set width', () => {
    const instance = new Stage(document.createElement('canvas'), {
      width: 500,
    })
    expect(instance.width).toBe(500)
  })

  it('should set height', () => {
    const instance = new Stage(document.createElement('canvas'), {
      height: 500,
    })
    expect(instance.height).toBe(500)
  })

  it('should set dimensions', () => {
    const instance = new Stage(document.createElement('canvas'), {
      width: 500,
      height: 500,
    })
    expect(instance.width).toBe(500)
    expect(instance.height).toBe(500)
  })

  it('should set pixelRatio', () => {
    const instance = new Stage(document.createElement('canvas'), {
      width: 500,
      height: 500,
      pixelRatio: 2,
    })
    expect(instance.canvas.width).toBe(1000)
    expect(instance.canvas.height).toBe(1000)
    expect(instance.canvas.style.width).toBe('500px')
    expect(instance.canvas.style.height).toBe('500px')
  })

  it('should set frames', () => {
    const frame = new Frame()

    const instance = new Stage(document.createElement('canvas'), {
      frames: [frame],
    })

    expect(instance.frames).toEqual([frame])

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(frame.stage).toEqual(instance)
  })

  it('should have registered events', () => {
    const onMousedown = spyOn<any>(Stage.prototype, 'onMousedown')
    const onMouseup = spyOn<any>(Stage.prototype, 'onMouseup')
    const onMousemove = spyOn<any>(Stage.prototype, 'onMousemove')

    const instance = new Stage(document.createElement('canvas'), {
      width: 500,
      height: 500,
    })

    dispatch(instance.canvas, 'mousedown', { clientY: 501, clientX: 501 })
    expect(onMousedown).toHaveBeenCalled()

    dispatch(instance.canvas, 'mouseup', { clientY: 501, clientX: 501 })
    expect(onMouseup).toHaveBeenCalled()

    dispatch(instance.canvas, 'mousemove', { clientY: 501, clientX: 501 })
    expect(onMousemove).toHaveBeenCalled()
  })

  it('should watch currentFrameIndex', () => {
    const instance = new Stage(document.createElement('canvas'))
    watcher(
      () => instance.currentFrameIndex,
      () => {
        console.log('changed')
      },
      { deep: true }
    )
    console.log(instance.currentFrameIndex)
    instance.currentFrameIndex = 1
    console.log(instance.currentFrameIndex)
    //expect(render).toHaveBeenCalled()
  })
})
