
import tools from '@/app/static/tools'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faChevronRight, faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react"
import {Animated, PanResponder, Platform, Pressable, SafeAreaView, StyleSheet, Text, View} from "react-native"
import {SafeAreaContext} from "react-native-safe-area-context";
const { displayMoney } = tools
const shadowSettings = {
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
}
const shadowSettings2 = {
    shadowColor: '#000',
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
}
export interface HaggleBoxRef {
    collapse: () => void
    expand: () => void
    startDrag: () => void
    updateDrag: (dy: number) => void
    endDrag: (dy: number, vy: number) => void
}

const HaggleBox = forwardRef<HaggleBoxRef>((_, ref) => {
    const [ dealStarted, setDealStarted ] = useState(false)
    const [ , setIsCollapsed ] = useState(false)
    const [ showAddTime ] = useState(true)
    const animationController = useRef(new Animated.Value(0)).current
    const gestureStartValue = useRef(0)

    // Animation duration constants
    const DURATION_FLICK_EXPAND = 120
    const DURATION_FLICK_COLLAPSE = 100
    const DURATION_TAP_EXPAND = 250
    const DURATION_TAP_COLLAPSE = 180
    const DURATION_FOLLOW_FINGER = 100 //Speed of the rest of the animation

    // Custom easing function: ease-out cubic
    const customEasing = (t: number): number => {
       return t
    }

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

    const toggleCollapsed = () => {
        let nextCollapsed
        setIsCollapsed(prev => {
            nextCollapsed = !prev
            return nextCollapsed
        })

        const duration = nextCollapsed ? DURATION_TAP_COLLAPSE : DURATION_TAP_EXPAND
        Animated.timing(animationController, {
            toValue: nextCollapsed ? 1 : 0,
            duration,
            useNativeDriver: false, // we animate height, so must be false
            easing: customEasing,
        }).start()

    }

    const startDrag = () => {
        animationController.stopAnimation((value: number) => {
            gestureStartValue.current = value
        })
    }

    const updateDrag = (dy: number) => {
        // Allow some over-drag past 0/1 with a rubber-band effect
        const raw = gestureStartValue.current - dy / 200

        let newValue = raw
        if (raw < 0) {
            // Ease out as you pull past fully expanded
            newValue = -Math.atan(-raw) / (Math.PI / 2)
        } else if (raw > 1) {
            // Ease out as you pull past fully collapsed
            const over = raw - 1
            newValue = 1 + Math.atan(over) / (Math.PI / 2)
        }

        animationController.setValue(newValue)
    }

    const endDrag = (dy: number, vy: number) => {
        // Treat tiny movement as a tap
        if (Math.abs(dy) < 5 && Math.abs(vy) < 0.3) {
            toggleCollapsed()
            return
        }

        // Flicks: decide based mainly on velocity
        if (Math.abs(vy) > 1) {
            const shouldCollapse = vy < 0 // flick up = collapse
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

        // Follow finger: animate to nearest position
        const rawValue = gestureStartValue.current - dy / 200
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

    useImperativeHandle(ref, () => ({
        collapse,
        expand,
        startDrag,
        updateDrag,
        endDrag,
    }))

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
                    // Allow some over-drag past 0/1 with a rubber-band effect
                    const raw = gestureStartValue.current - dy / 200

                    let newValue = raw
                    if (raw < 0) {
                        // Ease out as you pull past fully expanded
                        newValue = -Math.atan(-raw) / (Math.PI / 2)
                    } else if (raw > 1) {
                        // Ease out as you pull past fully collapsed
                        const over = raw - 1
                        newValue = 1 + Math.atan(over) / (Math.PI / 2)
                    }

                    animationController.setValue(newValue)
                },
                onPanResponderRelease: (_, { dy, vy }) => {
                    // Treat tiny movement as a tap
                    if (Math.abs(dy) < 5 && Math.abs(vy) < 0.3) {
                        toggleCollapsed()
                        return
                    }

                    // Flicks: decide based mainly on velocity
                    if (Math.abs(vy) > 1) {
                        const shouldCollapse = vy < 0 // flick up = collapse
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

                    // Follow finger: animate to nearest position
                    const rawValue = gestureStartValue.current - dy / 200
                    const clampedValue = Math.max(0, Math.min(1, rawValue))
                    const shouldCollapse = clampedValue > 0.5

                    setIsCollapsed(shouldCollapse)
                    Animated.timing(animationController, {
                        toValue: shouldCollapse ? 1 : 0,
                        duration: DURATION_FOLLOW_FINGER,
                        useNativeDriver: false,
                        easing: customEasing,
                    }).start()
                },
            }),
        [animationController],
    )

    // Raw animationController may go slightly beyond [0,1] during rubber-band.
    // visualProgress is clamped so only height stretches; everything else stays in-range.
    const visualProgress = animationController.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: "clamp",
    })

    const animatedHeight = animationController.interpolate({
        // Give the green bar more stretch past both ends
        inputRange: [-0.6, 0, 1, 1.6],
        outputRange: [210, 160, 100, 70],
    })

    const animatedRotate = visualProgress.interpolate({
        inputRange: [0, 1],
        outputRange: ["-90deg", "90deg"],
    })

    const animatedFontSize = visualProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [80, 28],
    })

    const animatedPaddingBottom = visualProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [Platform.OS === 'web' ? 200 : 45, 0],
    })

    // Use animationController directly to allow rubberband movement
    // Match the green section's height change: 160->210 = 50px increase when rubberbanding down
    const animatedSubTranslateY = animationController.interpolate({
        inputRange: [-0.6, 0, 1, 1.6],
        outputRange: [50, 0, -180, -210], // Move down proportionally with green section stretch
    })
    const animatedSubOpacity = visualProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1],
    })

    const animatedCheveronPadding =visualProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [25, 0],
    })

    // Animate shadow opacity: stronger when between positions (during transition)
    // Peaks at 0.35 in the middle, returns to 0.15 at extremes
    const animatedShadowOpacity = visualProgress.interpolate({
        inputRange: [0, 0.1, 0.5, 0.999, 1],
        outputRange: [0, 0.25, 0.25, 0.25, 0],
    })

    const MONEY_AMOUNT = 800

    return (
        <SafeAreaContext style={styles.wrapper}>
            <Animated.View // Gummy Green Section
                style={[
                    styles.bg,
                    {
                        height: animatedHeight,
                        paddingTop: animatedPaddingBottom,
                        ...shadowSettings2,
                        shadowOpacity: animatedShadowOpacity,
                    }
                ]}
                { ...panResponder.panHandlers }
            >
                <View style={styles.row}>
                    <Animated.Text style={[styles.money, { fontSize: animatedFontSize }]}>
                        {displayMoney(MONEY_AMOUNT, false)}
                    </Animated.Text>
                    <Animated.View style={[styles.chevronContainer, { paddingTop: animatedCheveronPadding }]}>
                        <Animated.View style={{ transform: [{ rotate: animatedRotate }] }}>
                            <FontAwesomeIcon
                                icon={faChevronRight as IconProp}
                            />
                        </Animated.View>
                    </Animated.View>
                </View>
            </Animated.View>
            <>
            <Animated.View
                style={[
                    styles.subHaggleContainer,
                    {
                        opacity: animatedSubOpacity,
                        height: 120,
                        transform: [{ translateY: animatedSubTranslateY }],
                    },
                ]}
                {...panResponder.panHandlers}
            >
                {showAddTime && (
                    <Pressable
                        style={styles.addTimeRow}
                    >
                        <FontAwesomeIcon
                            icon={faClock as IconProp}
                            style={styles.addTimeIcon}
                        />
                        <Text style={styles.addTimeText}>Add Time</Text>
                    </Pressable>
                )}
                <View style={styles.subHaggleButtonsRow}>
                    <Pressable style={styles.subHaggleBtn}>
                        <Text>Counter</Text>
                    </Pressable>
                    <Pressable style={styles.subHaggleBtn}>
                        <Text>Accept</Text>
                    </Pressable>
                </View>
            </Animated.View>

            </>
        </SafeAreaContext>
    )
})

HaggleBox.displayName = 'HaggleBox'


const styles = StyleSheet.create({
    wrapper: {
        position: "relative",
        ...(Platform.OS === 'web' && {
            marginTop: -44, // Compensate for safe area insets on web
            paddingTop: 0,
        }),
        backgroundColor: 'blue'
    },
    bg: {
        backgroundColor: "#00CB4E",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        fontWeight: "bold",
        fontSize: 100,
        zIndex: 2,
    },
    text: {
        fontSize: 20,
        fontFamily: 'Koulen',
    },
    centerContent: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    subHaggleContainer: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#EDEDED",
        marginTop: 0,
        position: "absolute",
        bottom: 45,
        top: 160,
        left: 0,
        zIndex: 1,

            ...shadowSettings,
    },
    subHaggleBtn: {
        width: "50%",
        display: 'flex',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#EDEDED",
        paddingBlock: 20
    },
    money: {
        fontSize: 40,
        fontFamily: 'Koulen',
        //    backgroundColor: "white",
    },
    addTimeRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        backgroundColor: "#EDEDED",
    },
    addTimeIcon: {
        marginRight: 10,
    },
    addTimeText: {
        fontSize: 24,
    },
    subHaggleButtonsRow: {
        flexDirection: "row",
    },
    row: {
        display: "flex",
        flexDirection: "row",
    },
    chevronContainer: {
        //    backgroundColor:"blue",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 25,
    },
})

export default HaggleBox