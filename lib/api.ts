import { API_BASE_URL } from './config'

export type Channel = {
  id: number
  name: string
  type: 'direct' | 'group'
  created_by_id: number | null
  created_at: string
  updated_at: string | null
  created_by?: { id: number; full_name: string | null; email: string }
  members?: Array<{ id: number; full_name: string | null; email: string }>
}

export type Message = {
  id: number
  channelId: number
  userId: number
  body: string
  createdAt: string
  user?: { id: number; fullName: string | null; email: string }
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...init } = options
  const url = `${API_BASE_URL}${path}`
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  }
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }
  const res = await fetch(url, { ...init, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error((err as { message?: string }).message || res.statusText)
  }
  return res.json() as Promise<T>
}

export const api = {
  channels: {
    list: (token: string) =>
      request<{ data: Channel[] }>('/api/channels', { token }).then((r) => r.data),

    get: (id: number, token: string) =>
      request<{ data: Channel }>(`/api/channels/${id}`, { token }).then((r) => r.data),

    create: (
      body: { name: string; type: 'direct' | 'group'; memberIds?: number[] },
      token: string
    ) =>
      request<{ data: Channel }>('/api/channels', {
        method: 'POST',
        body: JSON.stringify(body),
        token,
      }).then((r) => r.data),
  },

  messages: {
    list: (
      channelId: number,
      token: string,
      params?: { beforeId?: number; limit?: number }
    ) => {
      const search = new URLSearchParams()
      if (params?.beforeId != null) search.set('beforeId', String(params.beforeId))
      if (params?.limit != null) search.set('limit', String(params.limit))
      const q = search.toString()
      return request<{ data: Message[] }>(
        `/api/channels/${channelId}/messages${q ? `?${q}` : ''}`,
        { token }
      ).then((r) => r.data)
    },

    create: (channelId: number, body: string, token: string) =>
      request<{ data: Message }>(`/api/channels/${channelId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ body }),
        token,
      }).then((r) => r.data),
  },
}
