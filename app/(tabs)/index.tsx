import { Platform, StyleSheet } from 'react-native'
import Chat from "@/app/(tabs)/chat"
import HaggleBox from "@/app/(tabs)/chat/components/HaggleBox"

export default function HomeScreen() {
  return (
    <HaggleBox/>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
})
