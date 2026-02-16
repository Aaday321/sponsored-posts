/**
 * API and WebSocket base URL.
 * - Simulator: use localhost or your machine IP.
 * - Android emulator: use 10.0.2.2 for host machine.
 * - Real device: use your machine IP (e.g. http://192.168.1.10:3333).
 */
const getBaseUrl = () => {
  if (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, '')
  }
  return 'http://localhost:3333'
}

export const API_BASE_URL = getBaseUrl()
export const WS_URL = getBaseUrl()
