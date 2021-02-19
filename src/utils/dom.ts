import { error } from './logs'

export function isElement<Type extends typeof HTMLElement>(element: unknown, type: Type) {
    if (!(element instanceof type)) {
        error(`The given element is not a valid ${type.name}.`)
    }

    return element as unknown as InstanceType<Type>
}