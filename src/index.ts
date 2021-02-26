import { Frame, Stage } from '@/containers'

import { Shape } from '@/shapes'
import { transitions } from '@/transitions'

const dessin = {
  Stage,
  Frame,
  Shape,
  utils: {
    transitions,
  },
}

export { Stage, Frame, Shape, transitions }

export default dessin

if (typeof window !== 'undefined') {
  window.dessin = dessin
}

declare global {
  interface Window {
    dessin: typeof dessin
  }
}
