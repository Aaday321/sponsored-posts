import ChatInput from "@/app/components/ChatInput"
import MessageList from "@/app/components/MessageList"
import YES from "@/app/components/YES"
import { useChatChannel } from "@/hooks/useChatChannel"
import { useAuth } from "@/lib/auth-context"
import { useLocalSearchParams } from "expo-router"
import { ActivityIndicator, StyleSheet, Text, View } from "react-native"

export default function ChatScreen() {
  const { channelId: channelIdParam } = useLocalSearchParams<{ channelId?: string }>()
  const channelId = channelIdParam ? parseInt(channelIdParam, 10) : 1
  const { isAuthenticated, token } = useAuth()
  const {
    messages,
    isLoading,
    isConnected,
    typingUser,
    sendMessage,
    sendTypingStart,
    sendTypingStop,
  } = useChatChannel(isAuthenticated && token && !Number.isNaN(channelId) ? channelId : null)

  if (!isAuthenticated || !token) {
    return (
      <YES topOnly={true}>
        <View style={styles.centered}>
          <Text style={styles.placeholderText}>
            Sign in and set your token to use chat. Use AuthProvider setAuth(token, userId).
          </Text>
        </View>
      </YES>
    )
  }

  if (isLoading) {
    return (
      <YES topOnly={true}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#00CB4E" />
        </View>
      </YES>
    )
  }

  return (
    <YES topOnly={true}>
      <View style={styles.screen}>
        {!isConnected && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>Reconnecting…</Text>
          </View>
        )}
        {typingUser && (
          <View style={styles.typingBanner}>
            <Text style={styles.typingText}>{typingUser} is typing</Text>
          </View>
        )}
        <View style={styles.chatWrapper}>
          <MessageList messages={messages} />
          <ChatInput
            onSend={sendMessage}
            onFocus={sendTypingStart}
            onBlur={sendTypingStop}
          />
        </View>
      </View>
    </YES>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  chatWrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 24,
  },
  placeholderText: {
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },
  banner: {
    padding: 8,
    backgroundColor: "#fff3cd",
  },
  bannerText: {
    textAlign: "center",
    fontSize: 12,
    color: "#856404",
  },
  typingBanner: {
    padding: 4,
    backgroundColor: "#f0f0f0",
  },
  typingText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
})
