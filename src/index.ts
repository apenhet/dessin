/**
 *
 *
 * @export
 * @param {number} foo
 * @param {string} truc
 * @param {boolean} [bar]
 * @return {*}  {string}
 */
export function doSomething(foo: number, truc: string, bar?: boolean): string {
    if (bar) {
        return truc + foo
    }
    throw new Error('No way.')
}