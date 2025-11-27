import {View, Text, StyleSheet, Pressable} from "react-native"

export default function Chat() {

    function handlePress() {
        console.log("Press")
    }

    return (
        <View style={styles.bg}>
            <Text style={styles.text}>Chat</Text>
            <Pressable style={styles.btn} onPress={handlePress}>
                <Text>Press Me</Text>
            </Pressable>
        </View>
    )
}


const styles = StyleSheet.create({
    bg: {
        backgroundColor: "black",
        height: "100%",
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
