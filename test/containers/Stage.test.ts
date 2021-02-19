import { Stage } from '@/index'

describe('Stage', () => {
    it('should create a new Stage instance', () => {
        const instance = new Stage(document.createElement('canvas'))
        expect(instance).toBeInstanceOf(Stage)
    })

    it('should throw an error if element isn\'t canvas', () => {
        const element = document.createElement('p') as unknown as HTMLCanvasElement
        expect(() => new Stage(element)).toThrow()
        expect(() => new Stage('p')).toThrow()
    })

    it('should set width', () => {
        const instance = new Stage(document.createElement('canvas'), {
            width: 500
        })
        expect(instance.width).toBe(500)
    })

    it('should set height', () => {
        const instance = new Stage(document.createElement('canvas'), {
            height: 500
        })
        expect(instance.height).toBe(500)
    })

    it('should set dimensions', () => {
        const instance = new Stage(document.createElement('canvas'), {
            width: 500,
            height: 500
        })
        expect(instance.width).toBe(500)
        expect(instance.height).toBe(500)
    })

    it('should set pixelRatio', () => {
        const instance = new Stage(document.createElement('canvas'), {
            width: 500,
            height: 500,
            pixelRatio: 2
        })
        expect(instance.canvas?.width).toBe(1000)
        expect(instance.canvas?.height).toBe(1000)
        expect(instance.canvas?.style.width).toBe('500px')
        expect(instance.canvas?.style.height).toBe('500px')
    })
})