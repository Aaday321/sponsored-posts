import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { Platform } from 'react-native'
import 'react-native-reanimated'
import { useColorScheme } from '@/hooks/use-color-scheme'
import { useFonts } from "expo-font"
import {QueryClientProvider} from "@tanstack/react-query"
import {QueryClient} from "@tanstack/query-core"

export const unstable_settings = {
  anchor: '(tabs)',
}

export default function RootLayout() {
  const colorScheme = useColorScheme()

  const [ loaded ] = useFonts({
      Koulen: require('../assets/fonts/Koulen/static/Koulen.ttf'),
  })

  const queryClient = new QueryClient()

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <QueryClientProvider client={queryClient}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          {Platform.OS !== 'web' && <StatusBar style="auto" />}
        </QueryClientProvider>
    </ThemeProvider>
  )
}
