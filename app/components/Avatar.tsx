import { StyleSheet, View } from "react-native"

interface AvatarProps {
    size?: number
}

export default function Avatar({ size = 40 }: AvatarProps) {
    return (
        <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
            <View style={[styles.avatarPlaceholder, { width: size * 0.75, height: size * 0.75, borderRadius: (size * 0.75) / 2 }]} />
        </View>
    )
}

const styles = StyleSheet.create({
    avatar: {
        marginRight: 8,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarPlaceholder: {
        backgroundColor: '#C0C0C0',
    },
})

