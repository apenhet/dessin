import { animate } from '@/utils/animations'

const duration = 100

describe('Animations', () => {
  it('should increment from 0 to 10 (normal)', async () => {
    const { current } = await animate({
      from: 0,
      to: 10,
      duration,
    })

    expect(current).toEqual(10)
  })

  it('should decrement from 10 to 0 (reverse)', async () => {
    const { current } = await animate({
      from: 0,
      to: 10,
      direction: 'reverse',
      duration,
    })

    expect(current).toEqual(0)
  })

  it('should increment from 0 to 10, then 10 to 0 (alternate)', async () => {
    const { current } = await animate({
      from: 0,
      to: 10,
      direction: 'alternate',
      iteration: 2,
      duration,
    })

    expect(current).toEqual(0)
  })

  it('should increment from 10 to 0, then 0 to 10 (alternate-reverse)', async () => {
    const { current } = await animate({
      from: 0,
      to: 10,
      direction: 'alternate-reverse',
      iteration: 2,
      duration,
    })

    expect(current).toEqual(10)
  })

  it('should work with string', async () => {
    const { current } = await animate({
      from: 'Foo',
      to: 'Bar',
      duration,
    })

    expect(current).toEqual('Bar')
  })

  it('should work with object', async () => {
    const { current } = await animate({
      from: {
        number: 10,
        string: 'Foo',
        object: { number: 34, string: 'NestedFoo' },
      },
      to: {
        number: 20,
        string: 'Bar',
        object: { number: 42, string: 'NestedBar' },
      },
      duration,
    })

    expect(current).toEqual({
      number: 20,
      string: 'Bar',
      object: { number: 42, string: 'NestedBar' },
    })
  })

  it('should work with arrays', async () => {
    const { current } = await animate({
      from: {
        number: 10,
        string: 'Foo',
        array: [
          { number: 34, string: 'NestedFoo' },
          { number: 65, string: 'NestedFoo2' },
        ],
      },
      to: {
        number: 20,
        string: 'Bar',
        array: [
          { number: 82, string: 'NestedBar' },
          { number: 65, string: 'NestedBar2' },
        ],
      },
      duration,
    })

    expect(current).toEqual({
      number: 20,
      string: 'Bar',
      array: [
        { number: 82, string: 'NestedBar' },
        { number: 65, string: 'NestedBar2' },
      ],
    })
  })
})
