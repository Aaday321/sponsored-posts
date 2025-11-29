import { useRef } from "react"
import { Keyboard, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet } from "react-native"
import Message, { type MessageData } from "./Message"

interface MessageListProps {
    messages: MessageData[]
}

export default function MessageList({ messages }: MessageListProps) {
    const lastScrollY = useRef(0)
    const isUserScrolling = useRef(false)

    const handleScrollBeginDrag = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        isUserScrolling.current = true
        lastScrollY.current = event.nativeEvent.contentOffset.y
    }

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (!isUserScrolling.current) return 
        
        const currentScrollY = event.nativeEvent.contentOffset.y
        const scrollDelta = currentScrollY - lastScrollY.current
        
        // Only dismiss keyboard when scrolling up (scrollY decreasing = moving towards older messages)
        // Scroll up = scrollY decreasing = dismiss keyboard
        // Scroll down = scrollY increasing = keep keyboard open
        if (scrollDelta < -5) {
            Keyboard.dismiss()
        }
        
        lastScrollY.current = currentScrollY
    }

    const handleScrollEndDrag = () => {
        isUserScrolling.current = false
    }

    return (
        <ScrollView
            style={styles.chatArea}
            contentContainerStyle={styles.chatContent}
            showsVerticalScrollIndicator={true}
            onScrollBeginDrag={handleScrollBeginDrag}
            onScroll={handleScroll}
            onScrollEndDrag={handleScrollEndDrag}
            onMomentumScrollEnd={handleScrollEndDrag}
            scrollEventThrottle={16}
            keyboardShouldPersistTaps="handled"
        >
            {messages.map((message) => (
                <Message key={message.id} message={message} />
            ))}
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    chatArea: {
        flex: 1,
    },
    chatContent: {
        padding: 16,
        paddingBottom: 20,
    },
})

