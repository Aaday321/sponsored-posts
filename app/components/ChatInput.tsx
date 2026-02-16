import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faPaperclip, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { useState } from "react"
import { Pressable, StyleSheet, TextInput, View } from "react-native"

interface ChatInputProps {
    onSend?: (text: string) => void
    onFocus?: () => void
    onBlur?: () => void
}

export default function ChatInput({ onSend, onFocus, onBlur }: ChatInputProps) {
    const [inputText, setInputText] = useState('')

    const handleSend = () => {
        const trimmed = inputText.trim()
        if (trimmed && onSend) {
            onSend(trimmed)
            setInputText('')
        }
    }

    return (
        <View style={styles.inputContainer}>
            <Pressable style={styles.iconButton}>
                <FontAwesomeIcon
                    icon={faPaperclip as IconProp}
                    style={styles.icon}
                />
            </Pressable>
            <TextInput
                style={styles.input}
                placeholder="I need an ad that..."
                placeholderTextColor="#999"
                value={inputText}
                onChangeText={setInputText}
                onSubmitEditing={handleSend}
                onFocus={onFocus}
                onBlur={onBlur}
                returnKeyType="send"
            />
            <Pressable style={styles.iconButton} onPress={handleSend}>
                <FontAwesomeIcon
                    icon={faPaperPlane as IconProp}
                    style={styles.icon}
                />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        backgroundColor: '#EDEDED',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#00CB4E",
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 4,
    },
    icon: {
        color: '#FFFFFF',
    },
    input: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 16,
        marginHorizontal: 8,
        maxHeight: 100,
    },
})

