import Stage from '@/containers/Stage'

const dessin = {
  Stage,
}

export {
  Stage
}

export default dessin

if (typeof window !== 'undefined') {
  window.dessin = dessin
}

declare global {
  interface Window {
    dessin: typeof dessin;
  }
}
