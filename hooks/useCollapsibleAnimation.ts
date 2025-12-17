import { useMemo, useRef, useState } from 'react'
import { Animated, PanResponder } from 'react-native'

// Animation duration constants
const DURATION_FLICK_EXPAND = 120
const DURATION_FLICK_COLLAPSE = 100
const DURATION_TAP_EXPAND = 250
const DURATION_TAP_COLLAPSE = 120
const DURATION_FOLLOW_FINGER = 100 // Speed of the rest of the animation

export interface CollapsibleAnimationConfig {
  dragSensitivity?: number // pixels per animation unit (default: 200)
  tapThreshold?: number // max dy for tap detection (default: 5)
  velocityThreshold?: number // min velocity for flick detection (default: 1)
}

export interface CollapsibleAnimationReturn {
  animationController: Animated.Value
  isCollapsed: boolean
  collapse: () => void
  expand: () => void
  toggle: () => void
  startDrag: () => void
  updateDrag: (dy: number) => void
  endDrag: (dy: number, vy: number) => void
  panResponder: ReturnType<typeof PanResponder.create>
}

export function useCollapsibleAnimation(
  config: CollapsibleAnimationConfig = {}
): CollapsibleAnimationReturn {
  const {
    dragSensitivity = 200,
    tapThreshold = 5,
    velocityThreshold = 1,
  } = config

  const [isCollapsed, setIsCollapsed] = useState(false)
  const animationController = useRef(new Animated.Value(0)).current
  const gestureStartValue = useRef(0)

  const customEasing = (t: number): number => t

  const collapse = () => {
    setIsCollapsed(true)
    Animated.timing(animationController, {
      toValue: 1,
      duration: DURATION_FLICK_COLLAPSE,
      useNativeDriver: false,
      easing: customEasing,
    }).start()
  }

  const expand = () => {
    setIsCollapsed(false)
    Animated.timing(animationController, {
      toValue: 0,
      duration: DURATION_FLICK_EXPAND,
      useNativeDriver: false,
      easing: customEasing,
    }).start()
  }

  const toggle = () => {
    setIsCollapsed((prev) => {
      const nextCollapsed = !prev
      const duration = nextCollapsed ? DURATION_TAP_COLLAPSE : DURATION_TAP_EXPAND
      Animated.timing(animationController, {
        toValue: nextCollapsed ? 1 : 0,
        duration,
        useNativeDriver: false,
        easing: customEasing,
      }).start()
      return nextCollapsed
    })
  }

  const startDrag = () => {
    animationController.stopAnimation((value: number) => {
      gestureStartValue.current = value
    })
  }

  const updateDrag = (dy: number) => {
    const raw = gestureStartValue.current - dy / dragSensitivity

    let newValue = raw
    if (raw < 0) {
      newValue = -Math.atan(-raw) / (Math.PI / 2)
    } else if (raw > 1) {
      const over = raw - 1
      newValue = 1 + Math.atan(over) / (Math.PI / 2)
    }

    animationController.setValue(newValue)
  }

  const endDrag = (dy: number, vy: number) => {
    if (Math.abs(dy) < tapThreshold && Math.abs(vy) < 0.3) {
      toggle()
      return
    }

    if (Math.abs(vy) > velocityThreshold) {
      const shouldCollapse = vy < 0
      setIsCollapsed(shouldCollapse)
      const duration = shouldCollapse ? DURATION_FLICK_COLLAPSE : DURATION_FLICK_EXPAND
      Animated.timing(animationController, {
        toValue: shouldCollapse ? 1 : 0,
        duration,
        useNativeDriver: false,
        easing: customEasing,
      }).start()
      return
    }

    const rawValue = gestureStartValue.current - dy / dragSensitivity
    const clampedValue = Math.max(0, Math.min(1, rawValue))
    const shouldCollapse = clampedValue > 0.5

    setIsCollapsed(shouldCollapse)
    Animated.timing(animationController, {
      toValue: shouldCollapse ? 1 : 0,
      duration: DURATION_FOLLOW_FINGER,
      useNativeDriver: false,
      easing: customEasing,
    }).start()
  }

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          animationController.stopAnimation((value: number) => {
            gestureStartValue.current = value
          })
        },
        onPanResponderMove: (_, { dy }) => {
          updateDrag(dy)
        },
        onPanResponderRelease: (_, { dy, vy }) => {
          endDrag(dy, vy)
        },
      }),
    [animationController]
  )

  return {
    animationController,
    isCollapsed,
    collapse,
    expand,
    toggle,
    startDrag,
    updateDrag,
    endDrag,
    panResponder,
  }
}
