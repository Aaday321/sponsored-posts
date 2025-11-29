import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { useMemo, useState } from "react"
import { Animated, Pressable, StyleSheet, Text, View } from "react-native"


export default function HaggleBox() {
    const [ dealStarted, setDealStarted ] = useState(false)
    const [ isCollapsed, setIsCollapsed ] = useState(false)
    const animation = useMemo(() => new Animated.Value(0), [])

    const toggleCollapsed = () => {
        let nextCollapsed
        setIsCollapsed(prev => {
            nextCollapsed = !prev
            return nextCollapsed
        })

        Animated.timing(animation, {
            toValue: nextCollapsed ? 1 : 0,
            duration: 250,
            useNativeDriver: false, // we animate height, so must be false
        }).start()
    }

    const animatedHeight = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [160, 100],
    })

    const animatedRotate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ["90deg", "0deg"],
    })

    const animatedFontSize = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [70, 28],
    })

    const animatedPaddingBottom = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [45, 0],
    })

    const MONEY_AMOUNT = 800.00

    return (
        <>
            <Animated.View style={[styles.bg, { height: animatedHeight, paddingTop: animatedPaddingBottom }]}>
                <Pressable
                    onPress={!dealStarted ? toggleCollapsed : undefined}
                >
                    <View style={styles.row}>
                                <Animated.Text style={[styles.money, { fontSize: animatedFontSize }]}>
                                    ${MONEY_AMOUNT}
                                </Animated.Text>
                                <View style={styles.chevronContainer}>
                                    <Animated.View style={{ transform: [{ rotate: animatedRotate }] }}>
                                        <FontAwesomeIcon
                                            icon={faChevronRight as IconProp}
                                        />
                                    </Animated.View>
                                </View>
                            </View>
                </Pressable>
            </Animated.View>
            <View style={styles.subHaggleContainer}>
                <Pressable style={styles.subHaggleBtn}>
                    <Text>Counter</Text>
                </Pressable>
                <Pressable style={styles.subHaggleBtn}>
                    <Text>Accept</Text>
                </Pressable>
            </View>
        </>
    )
}


const styles = StyleSheet.create({
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
        flexDirection: "row",
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
        backgroundColor: "#EDEDED",
    },
    row: {
        display: "flex",
        flexDirection: "row",
    },
    chevronContainer: {
        backgroundColor:"blue",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
})
