export function error(message: string): never {
    throw new Error(`Dessin: ${message}`)
}

export function info(message: string) {
    console.info(`Dessin: ${message}`)
}

export function warn(message: string) {
    console.warn(`Dessin: ${message}`)
}

export function danger(message: string) {
    console.error(`Dessin: ${message}`)
}