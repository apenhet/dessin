/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ComputedRef,
  computed as vueComputed,
  reactive as vueReactive,
} from '@vue/reactivity'
import {
  watch as vueWatch,
  watchEffect as vueWatchEffect,
} from '@vue-reactivity/watch'

export function computed<Key extends string>(
  target: any,
  propertyKey: Key,
  descriptor: PropertyDescriptor
) {
  const { get, set } = descriptor
  let _computed: ComputedRef | null

  if (!get) return

  function setComputed(ctx: typeof target) {
    return (_computed =
      get && set
        ? vueComputed({ get: get.bind(ctx), set: set.bind(ctx) })
        : get
        ? vueComputed(get.bind(ctx))
        : null)
  }

  function getComputed(ctx: typeof target) {
    return _computed || setComputed(ctx)
  }

  descriptor.get = function (this: typeof target) {
    return getComputed(this)?.value
  }
}

const watchers: { [key: string]: any[] } = {}

export function watch(...keys: string[]) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const { name } = target.constructor
    watchers[name] = watchers[name] || []

    const watcher = function (instance: any) {
      vueWatch(
        () => keys.map((key) => instance[key]),
        descriptor.value.bind(instance)
      )
    }

    watchers[name].push(watcher)
  }
}

export function watchEffect(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const { name } = target.constructor
  watchers[name] = watchers[name] || []

  const watcher = function (instance: any) {
    vueWatchEffect(descriptor.value.bind(instance))
  }

  watchers[name].push(watcher)
}

export function reactive<T extends { new (...args: any[]): any }>(
  constructor: T
) {
  return class extends constructor {
    constructor(...args: any[]) {
      super(...args)
      const instance = vueReactive(this)
      watchers[constructor.name]?.forEach((fn) => fn(instance))
      return instance
    }
  }
}
