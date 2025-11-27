import { Pressable, StyleSheet, Text, View } from "react-native"
import { useState } from "react"
export default function HaggleBox() {

    const [dealStarted, setDealStarted] = useState(false)

    return (
        <>
            <Pressable style={styles.bg}>
                {
                    dealStarted ?
                        <Text style={styles.text}>Start Deal</Text>
                                :
                        <View style={{display: "flex", flexDirection:"row"}}>
                            <Text style={styles.money}>$800.00</Text>
                            <Text>{">"}</Text>
                        </View>
                }
            </Pressable>
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
        height: 160,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        fontWeight: "bold",
        fontSize: 100,
    },
    text: {
        fontSize: 20,
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
        fontSize: 30,
        fontFamily: 'Koulen',
        marginBottom: 15
    }
})
