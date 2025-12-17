
import tools from '@/app/static/tools'
import { useCollapsibleAnimation } from '@/hooks/useCollapsibleAnimation'
import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faChevronRight, faClock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { forwardRef, useImperativeHandle, useState } from "react"
import { Animated, Platform, Pressable, StyleSheet, Text, View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
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
    const [ showAddTime ] = useState(true)
    const [ subHaggleYValue, setSubHaggleYValue ] = useState(-70)

    const expandedHeight = 100
    const [ animatedHeightState, setAnimatedHeightState ] = useState(expandedHeight)

    const {
        animationController,
        collapse,
        expand,
        startDrag,
        updateDrag,
        endDrag,
        panResponder,
    } = useCollapsibleAnimation()

    useImperativeHandle(ref, () => ({
        collapse,
        expand,
        startDrag,
        updateDrag,
        endDrag,
    }))

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
        outputRange: [210, expandedHeight, 60, 50],
    })

    const animatedRotate = visualProgress.interpolate({
        inputRange: [0, 1],
        outputRange: ["-90deg", "90deg"],
    })

    const animatedFontSize = visualProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [55, 28],
    })

    const animatedPaddingBottom = visualProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [Platform.OS === 'web' ? 200 : 45, 0],
    })

    // Use animationController directly to allow rubberband movement
    // Match the green section's height change: 160->210 = 50px increase when rubberbanding down
    const animatedSubTranslateY = animationController.interpolate({
        inputRange: [-0.6, 0, 1, 1.6],
        outputRange: [45, 45, subHaggleYValue, subHaggleYValue], // Move down proportionally with green section stretch
    })
    const animatedSubOpacity = visualProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1],
    })

    const animatedCheveronPadding =visualProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [25, 0],
    })

    const animatedTop = visualProgress.interpolate({
        inputRange: [-0.6, 0, 1, 1.6],
        outputRange: [-20, 0, -20, -50],
    })

    // Animate shadow opacity: stronger when between positions (during transition)
    // Peaks at 0.35 in the middle, returns to 0.15 at extremes
    const animatedShadowOpacity = visualProgress.interpolate({
        inputRange: [0, 0.1, 0.5, 0.999, 1],
        outputRange: [0, 0.25, 0.25, 0.25, 0],
    })


    const insets = useSafeAreaInsets()
    const MONEY_AMOUNT = 800
    return (
        <>
            <View
                style={{
                    height: insets.top,
                    position: 'absolute',
                    backgroundColor: '#00CB4E',
                    width: '100%',
                    zIndex: 999,
                }}

            ></View>
            <SafeAreaView>
                <Animated.View // Gummy Green Section
                    style={[
                        styles.bg,
                        {
                            height: animatedHeight,
                           // paddingTop: animatedPaddingBottom,
                            ...shadowSettings2,
                            shadowOpacity: animatedShadowOpacity,
                         //   position: 'relative',
                            top: insets.top,
                            width: '100%',

                         //   bottom: animatedTop,
                         //   left: 0,
                        }
                    ]}
                    onLayout={(event) => {
                        const height = event.nativeEvent.layout.height
                        setAnimatedHeightState(height)
                        console.log("Green section height:", height)
                    }}
                    { ...panResponder.panHandlers }
                >
                    <View style={styles.row}>
                        <Animated.Text
                           style={[styles.money, { fontSize: animatedFontSize }]}
                        >
                            {displayMoney(MONEY_AMOUNT, false)}
                        </Animated.Text>
                        <View style={[styles.chevronContainer, {
                           // paddingTop: animatedCheveronPadding
                        }]}>
                            <Animated.View style={{
                                transform: [{ rotate: animatedRotate }],
                                //  backgroundColor: 'blue'
                            }}>
                                <FontAwesomeIcon
                                    icon={faChevronRight as IconProp}
                                />
                            </Animated.View>
                        </View>
                    </View>
                </Animated.View>
                <>
                <Animated.View
                    style={[
                        styles.subHaggleContainer,
                        {
                            top: (()=>{
                                const insetsTop = insets.top
                                const green = animatedHeightState
                                const sum = Number(green) + insetsTop
                                console.log({
                                    top: insetsTop,
                                    green,
                                    sum,
                                })
                                return sum - 45
                            })(),
                            //height: 200,
                            opacity: animatedSubOpacity,
                            transform: [{ translateY: animatedSubTranslateY }],
                        },
                    ]}
                    onLayout={(event) => {
                        const { height } = event.nativeEvent.layout
                        console.log({subHeight: height})
                        setSubHaggleYValue(height * -0.621)
                    }}
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
            </SafeAreaView>
        </>
    )
})

HaggleBox.displayName = 'HaggleBox'


const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: "red",
        zIndex: 3,
        flexGrow: 1,
    },
    bg: {
        display: "flex",
        fontWeight: "bold",
        fontSize: 100,
        zIndex: 200,
        backgroundColor: '#00CB4E',
      //  opacity: 0.5,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
    },
    text: {
        fontSize: 20,
        fontFamily: 'Koulen',
    },
    subHaggleContainer: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#EDEDED",
        marginTop: 0,
        position: "absolute",
        left: 0,

            ...shadowSettings,
    },
    subHaggleBtn: {
        width: "50%",
        justifyContent: "center",
        alignItems: "center",
      //  backgroundColor: "#EDEDED",
        paddingBlock: 20,
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
     //   backgroundColor: "#EDEDED",
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
        //backgroundColor: "#EDEDED",
      //  position: "relative",
      //  top: 3
    },
    chevronContainer: {
        //backgroundColor:"blue",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
})

export default HaggleBox