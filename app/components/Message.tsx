import { StyleSheet, View } from "react-native"
import Avatar from "./Avatar"
import PriceBubble from "./PriceBubble"
import TextBubble from "./TextBubble"

export interface MessageData {
    id: string
    type: 'text' | 'price'
    text?: string
    price?: number
    isFromUser: boolean
    timestamp?: string
}

interface MessageProps {
    message: MessageData
}

export default function Message({ message }: MessageProps) {
    return (
        <View
            style={[
                styles.messageContainer,
                message.isFromUser ? styles.messageRight : styles.messageLeft
            ]}
        >
            {!message.isFromUser && <Avatar />}
            {message.type === 'price' ? (
                <PriceBubble
                    price={message.price!}
                    timestamp={message.timestamp}
                    isFromUser={message.isFromUser}
                />
            ) : (
                <TextBubble
                    text={message.text!}
                    isFromUser={message.isFromUser}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    messageContainer: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-end',
    },
    messageLeft: {
        justifyContent: 'flex-start',
    },
    messageRight: {
        justifyContent: 'flex-end',
    },
})

