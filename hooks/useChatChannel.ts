import { useCallback, useEffect, useRef, useState } from 'react'
import { io, type Socket } from 'socket.io-client'
import { api, type Message } from '@/lib/api'
import { useAuth } from '@/lib/auth-context'
import { WS_URL } from '@/lib/config'
import type { MessageData } from '@/app/components/Message'

function mapMessage(
  m: Message & { user_id?: number; created_at?: string },
  currentUserId: number
): MessageData {
  const userId = m.userId ?? m.user_id
  const createdAt = m.createdAt ?? m.created_at ?? ''
  return {
    id: String(m.id),
    type: 'text',
    text: m.body,
    isFromUser: userId === currentUserId,
    timestamp: createdAt,
  }
}

export function useChatChannel(channelId: number | null) {
  const { token, userId } = useAuth()
  const [messages, setMessages] = useState<MessageData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [typingUser, setTypingUser] = useState<string | null>(null)
  const socketRef = useRef<Socket | null>(null)

  // Load initial messages
  useEffect(() => {
    if (!channelId || !token) {
      setIsLoading(false)
      return
    }
    let cancelled = false
    setIsLoading(true)
    api.messages
      .list(channelId, token, { limit: 50 })
      .then((data) => {
        if (cancelled || !userId) return
        setMessages(
          data.map((m) => mapMessage(m, userId)).sort((a, b) => (a.timestamp && b.timestamp ? (a.timestamp > b.timestamp ? 1 : -1) : 0))
        )
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [channelId, token, userId])

  // Socket: connect, join channel, subscribe to messages
  useEffect(() => {
    if (!channelId || !token || !userId) return

    const socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    })
    socketRef.current = socket

    socket.on('connect', () => {
      setIsConnected(true)
      socket.emit('join_channel', { channelId }, (res: { ok?: boolean }) => {
        if (!res?.ok) {
          console.warn('join_channel failed', res)
        }
      })
    })

    socket.on('disconnect', () => setIsConnected(false))
    socket.on('connect_error', () => setIsConnected(false))

    socket.on('message', (payload: Message) => {
      setMessages((prev) => {
        const next = [...prev, mapMessage(payload, userId)]
        return next.sort((a, b) =>
          a.timestamp && b.timestamp ? (a.timestamp > b.timestamp ? 1 : -1) : 0
        )
      })
    })

    socket.on('user_typing', (payload: { fullName?: string | null }) => {
      setTypingUser(payload.fullName ?? 'Someone')
    })
    socket.on('user_stopped_typing', () => setTypingUser(null))

    return () => {
      socket.emit('leave_channel', { channelId })
      socket.disconnect()
      socketRef.current = null
    }
  }, [channelId, token, userId])

  const sendMessage = useCallback(
    (body: string) => {
      if (!channelId || !token || !body.trim()) return
      const socket = socketRef.current
      if (socket?.connected) {
        socket.emit(
          'send_message',
          { channelId, body: body.trim() },
          (res: { ok?: boolean; message?: Message }) => {
            if (res?.ok && res.message) {
              setMessages((prev) => {
                const mapped = mapMessage(res.message!, userId!)
                if (prev.some((m) => m.id === mapped.id)) return prev
                return [...prev, mapped].sort((a, b) =>
                  a.timestamp && b.timestamp ? (a.timestamp > b.timestamp ? 1 : -1) : 0
                )
              })
            }
          }
        )
      } else {
        api.messages.create(channelId, body.trim(), token).then((m) => {
          setMessages((prev) => [...prev, mapMessage(m, userId!)])
        })
      }
    },
    [channelId, token, userId]
  )

  const sendTypingStart = useCallback(() => {
    socketRef.current?.emit('typing_start', { channelId })
  }, [channelId])

  const sendTypingStop = useCallback(() => {
    socketRef.current?.emit('typing_stop', { channelId })
  }, [channelId])

  return {
    messages,
    isLoading,
    isConnected,
    typingUser,
    sendMessage,
    sendTypingStart,
    sendTypingStop,
  }
}
