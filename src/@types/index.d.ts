type Methods<T> = {
  [K in keyof T]: T[K] extends (...args: any) => any ? K : never
}
type MethodNames<T> = Exclude<Methods<T>[keyof T], undefined>
type EventMethods<T> = {
  [K in keyof Methods<T>]: K extends `on${Capitalize<string>}` ? K : never
}
type EventMethodNames<T> = Exclude<
  EventMethods<T>[keyof EventMethods<T>],
  undefined
>
type EventNames<T> = Exclude<
  {
    [K in keyof EventMethods<T>]: K extends `on${infer Event}`
      ? Lowercase<Event>
      : never
  }[keyof EventMethods<T>],
  undefined
>
