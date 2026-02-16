import {Platform, StyleSheet, View} from 'react-native'
import HaggleBox from "@/app/components/HaggleBox"
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

export default function HomeScreen() {
    const insets = useSafeAreaInsets()
  return (
      <>
          <View
              style={{
                  height: insets.top,
                  position: 'absolute',
                  backgroundColor: '#00CB4E',
                  width: '100%',
                  zIndex: 999,
              }}

          ></View>
          <HaggleBox/>
      </>
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
