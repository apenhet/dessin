export const transitions: Transitions = {
  'slide-x': {
    enter: {
      from: {
        left: '100%',
      },
      to: {
        left: 0,
      },
    },
    leave: {
      from: {
        left: 0,
      },
      to: {
        left: '-100%',
      },
    },
  },
  'slide-y': {
    enter: {
      from: {
        top: '100%',
      },
      to: {
        top: 0,
      },
    },
    leave: {
      from: {
        top: 0,
      },
      to: {
        top: '-100%',
      },
    },
  },
}

export type Transitions = {
  [key: string]: Transition
}

export type Transition = {
  enter: {
    from: Partial<TransitionProperties>
    to: Partial<TransitionProperties>
  }
  leave: {
    from: Partial<TransitionProperties>
    to: Partial<TransitionProperties>
  }
}

export interface TransitionProperties {
  left: number | `${number}%`
  top: number | `${number}%`
  scaleX: number
  scaleY: number
  skewX: number
  skewY: number
  opacity: number
}
