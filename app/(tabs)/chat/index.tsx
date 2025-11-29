import HaggleBox, { type HaggleBoxRef } from "@/app/(tabs)/chat/components/HaggleBox"
import { useMemo, useRef } from "react"
import { PanResponder, Pressable, StyleSheet, Text, View } from "react-native"

export default function Chat() {
    const haggleBoxRef = useRef<HaggleBoxRef>(null)

    function handlePress() {
        console.log("Press")
    }

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onMoveShouldSetPanResponder: () => true,
                onPanResponderGrant: () => {
                    haggleBoxRef.current?.startDrag()
                },
                onPanResponderMove: (_, { dy }) => {
                    haggleBoxRef.current?.updateDrag(dy)
                },
                onPanResponderRelease: (_, { dy, vy }) => {
                    haggleBoxRef.current?.endDrag(dy, vy)
                },
            }),
        [],
    )

    return (
        <>
            <HaggleBox ref={haggleBoxRef} />
            <View style={styles.bg} {...panResponder.panHandlers}>
                <Text style={styles.text}>Chat</Text>
                <Pressable style={styles.btn} onPress={handlePress}>
                    <Text>Press Me</Text>
                </Pressable>
            </View>
        </>
    )
}


const styles = StyleSheet.create({
    bg: {
        backgroundColor: "blue",
        height: "100%",
        flexGrow: 1,

    },
    text: {
        marginTop: 50,
        color: "white",
    },
    btn: {
        backgroundColor: "white",
        padding: 20,
    }
})
