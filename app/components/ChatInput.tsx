import type { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faPaperclip, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { useState } from "react"
import { Pressable, StyleSheet, TextInput, View } from "react-native"

export default function ChatInput() {
    const [inputText, setInputText] = useState('')

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
            />
            <Pressable style={styles.iconButton}>
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

