import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NavigationContainer } from '@react-navigation/native'
import {Login, Register, ChiTietSP} from './screen';
import { BottomTab } from './navigation'




const Stack = createNativeStackNavigator();
const App=()=>{
    return(
        <SafeAreaView style={{flex: 1}} >
            <NavigationContainer >
                <Stack.Navigator>
                    <Stack.Screen name='Login' component={Login} options={{ headerShown: false }}/>
                    <Stack.Screen name='Register' component={Register} options={{ headerShown: false }}/>
                    <Stack.Screen name='BottomTab' component={BottomTab} options={{ headerShown: false }}/>
                    <Stack.Screen name='ChiTietSP' component={ChiTietSP} options={{ headerShown: false }}/>
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    )
}

export default App

const styles = StyleSheet.create({})