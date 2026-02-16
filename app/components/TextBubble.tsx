import { StyleSheet, Text, View } from "react-native"

interface TextBubbleProps {
    text: string
    isFromUser: boolean
}

export default function TextBubble({ text, isFromUser }: TextBubbleProps) {
    return (
        <View style={[
            styles.textBubble,
            isFromUser ? styles.textBubbleRight : styles.textBubbleLeft
        ]}>
            <Text style={styles.textMessage}>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    textBubble: {
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 10,
        maxWidth: '70%',
    },
    textBubbleLeft: {
        backgroundColor: '#EDEDED',
    },
    textBubbleRight: {
        backgroundColor: "#00CB4E",
    },
    textMessage: {
        fontSize: 16,
        color: '#000',
    },
})

