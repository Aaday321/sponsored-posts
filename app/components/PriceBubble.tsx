import tools from "@/app/static/tools"
const { displayMoney } = tools
import { StyleSheet, Text, View } from "react-native"

interface PriceBubbleProps {
    price: number
    timestamp?: string
}

export default function PriceBubble({ price, timestamp }: PriceBubbleProps) {
    return (
        <View style={styles.priceBubble}>
            {timestamp && (
                <Text style={styles.priceTimestamp}>{timestamp}</Text>
            )}
            <Text style={styles.priceText}>
                {displayMoney(price, false)}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    priceBubble: {
        backgroundColor: "#00CB4E",
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 12,
        maxWidth: '70%',
    },
    priceTimestamp: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    priceText: {
        fontSize: 32,
        fontFamily: 'Koulen',
        color: '#000',
    },
})

