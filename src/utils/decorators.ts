import { ComputedRef, computed as vueComputed } from '@vue/reactivity'

export function computed<Key extends string>(
    target: Record<Key, unknown>,
    propertyKey: Key,
    descriptor: PropertyDescriptor
) {
    const { get, set } = descriptor
    let _computed: ComputedRef | null

    if (!get) return

    function setComputed(ctx: typeof target) {
        return _computed = get && set ? vueComputed({ get: get.bind(ctx), set: set.bind(ctx) }) : get ? vueComputed(get.bind(ctx)) : null
    }

    function getComputed(ctx: typeof target) {
        return _computed || setComputed(ctx)
    }

    descriptor.get = function (this: typeof target) {
        return getComputed(this)?.value
    }
}
