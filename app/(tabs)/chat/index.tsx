import ChatInput from "@/app/components/ChatInput"
import HaggleBox, { type HaggleBoxRef } from "@/app/components/HaggleBox"
import { type MessageData } from "@/app/components/Message"
import MessageList from "@/app/components/MessageList"
import { useRef, useState } from "react"
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native"

export default function Chat() {
    const haggleBoxRef = useRef<HaggleBoxRef>(null)
    const [ messages ] = useState<MessageData[]>([
        {
            id: '1',
            type: 'price',
            price: 800,
            isFromUser: true,
            timestamp: 'price change'
        },
        {
            id: '2',
            type: 'text',
            text: 'You must be smoking crack',
            isFromUser: false,
        },
        {
            id: '3',
            type: 'price',
            price: 1200,
            isFromUser: false,
            timestamp: 'price change'
        },
        {
            id: '4',
            type: 'text',
            text: 'That price is way too high for what you\'re offering',
            isFromUser: true,
        },
        {
            id: '5',
            type: 'text',
            text: 'I think $1000 is more reasonable',
            isFromUser: false,
        },
        {
            id: '6',
            type: 'price',
            price: 1000,
            isFromUser: true,
            timestamp: 'price change'
        },
        {
            id: '7',
            type: 'text',
            text: 'Deal! When can you start?',
            isFromUser: false,
        },
        {
            id: '8',
            type: 'text',
            text: 'I can start next Monday',
            isFromUser: true,
        },
        {
            id: '9',
            type: 'text',
            text: 'Perfect, I\'ll send over the details',
            isFromUser: false,
        },
        {
            id: '10',
            type: 'price',
            price: 950,
            isFromUser: false,
            timestamp: 'price change'
        },
        {
            id: '11',
            type: 'text',
            text: 'Actually, can we do $950?',
            isFromUser: false,
        },
        {
            id: '12',
            type: 'text',
            text: 'Sure, that works for me',
            isFromUser: true,
        },
        {
            id: '13',
            type: 'price',
            price: 950,
            isFromUser: true,
            timestamp: 'price change'
        },
        {
            id: '14',
            type: 'text',
            text: 'Great! Looking forward to working with you',
            isFromUser: false,
        },
        {
            id: '15',
            type: 'text',
            text: 'Same here!',
            isFromUser: true,
        },
        {
            id: '16',
            type: 'text',
            text: 'I\'ll send the contract over by end of day',
            isFromUser: false,
        },
        {
            id: '17',
            type: 'text',
            text: 'Sounds good, thanks!',
            isFromUser: true,
        },
        {
            id: '18',
            type: 'price',
            price: 1100,
            isFromUser: false,
            timestamp: 'price change'
        },
        {
            id: '19',
            type: 'text',
            text: 'Wait, I need to reconsider the scope',
            isFromUser: false,
        },
        {
            id: '20',
            type: 'text',
            text: 'No problem, let me know what you need',
            isFromUser: true,
        },
    ])

    return (
        <View style={styles.screen}>
            <HaggleBox ref={haggleBoxRef} />
            <View style={styles.chatWrapper}>
                <KeyboardAvoidingView
                    style={styles.container}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <MessageList messages={messages} />
                    <ChatInput />
                </KeyboardAvoidingView>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        zIndex: -1
    },
    chatWrapper: {
        flex: 1,
        position: "relative",
        zIndex: -10,
    },
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        marginTop: 0,
        paddingTop: 0,
    },
})

