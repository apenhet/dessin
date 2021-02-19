import '@/index'

describe('installation', () => {
    test('should make dessin globally available', () => {
        expect(window.dessin).toBeDefined()
        expect(window.dessin).toHaveProperty('Stage')
    })
})