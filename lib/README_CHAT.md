# Chat integration (React Native ↔ as-server)

This app connects to the **as-server** chat API and Socket.IO for real-time messages.

## Setup

1. **API URL**  
   Set `EXPO_PUBLIC_API_URL` to your server (e.g. `http://localhost:3333` or `http://192.168.1.x:3333` on a real device).  
   Default: `http://localhost:3333`.

2. **Auth**  
   You must set an access token and user id so the app can call the API and connect to Socket.IO:
   - After login, call `setAuth(accessToken, userId)` from `useAuth()` (e.g. in your login screen).
   - The token is the one returned when creating an access token for the user (e.g. `user.accessTokens.create(...)` on the server).

3. **Chat tab**  
   Open the **Chat** tab. The screen uses `channelId=1` by default.  
   To open a specific channel: navigate to `/chat?channelId=2` (or pass `channelId` in search params).

## Flow

- **REST** (`lib/api.ts`): list channels, get channel, list messages, create message (fallback when socket is down).
- **Socket.IO** (`hooks/useChatChannel.ts`): connect with `auth.token`, join channel room, send/receive messages, typing indicators.
- **Auth** (`lib/auth-context.tsx`): holds `token` and `userId` in memory. Wrap the app with `AuthProvider` and call `setAuth(token, userId)` after login.

## Creating a channel

Use the API (e.g. from a “channels” screen) to create a channel and add members, then navigate to `/chat?channelId=<id>`.
