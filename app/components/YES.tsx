import {View} from "react-native"
import HaggleBox from "@/app/components/HaggleBox"
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context'

interface Props {
    children: any
}

export default function YES({children}: Props) {
    const insets = useSafeAreaInsets()
    return (
        <SafeAreaView>
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
            <View
                style={{
                    paddingTop: insets.top,
                    backgroundColor: 'blue',
                }}
            >
                {children}
            </View>
        </SafeAreaView>
    )
}