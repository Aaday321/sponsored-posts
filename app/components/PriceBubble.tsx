import tools from "@/app/static/tools"
const { displayMoney } = tools
import { StyleSheet, Text, View } from "react-native"

interface PriceBubbleProps {
    price: number
    timestamp?: string
    isFromUser?: boolean
}

export default function PriceBubble({ price, timestamp, isFromUser }: PriceBubbleProps) {
    const META_TEXT_PADDING = 10
    return (
        <View style={styles.PriceContainer}>
            {timestamp && (
                <Text
                    style={[
                        styles.priceTimestamp,
                        {
                            textAlign: isFromUser ? 'right' : 'left',
                            paddingLeft: !isFromUser ? META_TEXT_PADDING : 0,
                            paddingRight: !isFromUser ? 0 : META_TEXT_PADDING,
                        }
                    ]}
                >
                    {timestamp}
                </Text>
            )}
            <View style={styles.priceBubble}>
                <Text style={styles.priceText}>
                    {displayMoney(price, false)}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    PriceContainer: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '70%',
        justifyContent: 'flex-end',
    },
    priceBubble: {
        backgroundColor: "#00CB4E",
        borderRadius: 16,
        paddingHorizontal: 18,
    },
    priceTimestamp: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,

    },
    priceText: {
        fontSize: 42,
        fontFamily: 'Koulen',
        color: '#000',
    },
})

