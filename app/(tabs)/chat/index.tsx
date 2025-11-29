import {View, Text, StyleSheet, Pressable} from "react-native"
import HaggleBox from "@/app/(tabs)/chat/components/HaggleBox"

export default function Chat() {

    function handlePress() {
        console.log("Press")
    }

    return (
        <>
            <HaggleBox/>
            <View style={styles.bg}>
                <Text style={styles.text}>Chat</Text>
                <Pressable style={styles.btn} onPress={handlePress}>
                    <Text>Presssdsf Me</Text>
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
