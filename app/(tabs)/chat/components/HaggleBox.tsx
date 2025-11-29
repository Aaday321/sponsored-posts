
import tools from '@/app/static/tools'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faChevronRight, faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { useMemo, useRef, useState } from "react"
import { Animated, PanResponder, Pressable, StyleSheet, Text, View } from "react-native"
const { displayMoney } = tools


export default function HaggleBox() {
    const [ dealStarted, setDealStarted ] = useState(false)
    const [ , setIsCollapsed ] = useState(false)
    const [ showAddTime ] = useState(true)
    const animationController = useRef(new Animated.Value(0)).current
    const gestureStartValue = useRef(0)

    const toggleCollapsed = () => {
        let nextCollapsed
        setIsCollapsed(prev => {
            nextCollapsed = !prev
            return nextCollapsed
        })

        Animated.timing(animationController, {
            toValue: nextCollapsed ? 1 : 0,
            duration: 250,
            useNativeDriver: false, // we animate height, so must be false
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
                        Animated.timing(animationController, {
                            toValue: shouldCollapse ? 1 : 0,
                            duration: 180,
                            useNativeDriver: false,
                        }).start()
                        return
                    }

                    const rawValue = gestureStartValue.current - dy / 200
                    const clampedValue = Math.max(0, Math.min(1, rawValue))
                    const shouldCollapse = clampedValue > 0.5

                    setIsCollapsed(shouldCollapse)
                    Animated.timing(animationController, {
                        toValue: shouldCollapse ? 1 : 0,
                        duration: 200,
                        useNativeDriver: false,
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
        outputRange: [45, 0],
    })

    const animatedSubTranslateY = visualProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -150],
    })

    const animatedSubHeight = visualProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [110, 0],
    })

    const animatedSubOpacity = visualProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1],
    })

    const animatedCheveronPadding =visualProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [25, 0],
    })

    const MONEY_AMOUNT = 800

    return (
        <View style={styles.wrapper}>
            <Animated.View
                style={[styles.bg, { height: animatedHeight, paddingTop: animatedPaddingBottom }]}
                {...panResponder.panHandlers}
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
            <Animated.View
                style={[
                    styles.subHaggleContainer,
                    {
                        opacity: animatedSubOpacity,
                        height: animatedSubHeight,
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
        </View>
    )
}


const styles = StyleSheet.create({
    wrapper: {
        position: "relative",
    },
    bg: {
        backgroundColor: "#00CB4E",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        fontWeight: "bold",
        fontSize: 100,
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
        zIndex: -1,
        overflow: "hidden",
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
