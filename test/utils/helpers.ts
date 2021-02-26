/* eslint-disable @typescript-eslint/no-explicit-any */
export function dispatch(
  target: Element,
  type: string,
  opts: MouseEventInit = {}
) {
  const { left, top } = target.getBoundingClientRect()

  opts.clientX = opts.clientX ?? left
  opts.clientY = opts.clientY ?? top

  const event = new MouseEvent(type, opts)

  target.dispatchEvent(event)
}

export function wait(ms = 500) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

type Methods<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never
}[keyof T]

export function spy<Type extends any>(
  obj: Type,
  method: Methods<Type>
): jasmine.Spy
export function spy<Type extends any>(
  obj: unknown,
  method: Methods<Type> | string
): jasmine.Spy
export function spy<Type extends any>(obj: Type, method: string) {
  const prototype = Object.getPrototypeOf(obj)

  return spyOn(prototype, method)
}
