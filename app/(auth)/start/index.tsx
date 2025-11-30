
import HaggleBox, { type HaggleBoxRef } from "@/app/components/HaggleBox"
import { type MessageData } from "@/app/components/Message"
import { useMemo, useRef, useState } from "react"
import { PanResponder } from "react-native"
import ChatContainer from "@/app/(tabs)/chat"

export default function Index() {
    const haggleBoxRef = useRef<HaggleBoxRef>(null)
    const [messages] = useState<MessageData[]>([
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
    ])

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

    console.log({ messagesADE: messages })

    return (
        <>
        </>
    )
}

