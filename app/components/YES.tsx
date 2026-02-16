import HaggleBox from "@/app/components/HaggleBox"
import { View } from "react-native"
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

interface Props {
    children: any
    topOnly?: boolean
}

export default function YES({children, topOnly = false }: Props) {
    const insets = useSafeAreaInsets()
    return (
        <SafeAreaView style={{ flex: 1 }} edges={topOnly ? ['top'] : ['top', 'bottom']}>
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
                    flex: 1,
                }}
            >
                {children}
            </View>
        </SafeAreaView>
    )
}