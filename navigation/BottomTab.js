import { Image, StyleSheet, Text, Touchable, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Login, Register, Home, GioHang, YeuThich,LienHe } from '../screen';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';



const Tab = createBottomTabNavigator();

const BottomTab = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: styles.tabBarStyle }}>
            <Tab.Screen name='Home' component={Home} options={{
                tabBarIcon: ({focused,size,color}) => (
                    // <Image source={require('../assets/icon/home.png')} style={{ width: 30, height: 30, }} />
                    <Icon name='home' size={25} color={focused ? '#8bd9bc':'#444343'}/>

                )

            }} />
            <Tab.Screen name='GioHang' component={GioHang} options={{
                tabBarIcon: ({focused,size,color}) => (
                    <Icon name='cart-plus' size={25} color={focused ? '#8bd9bc':'#444343'}/>
                )

            }} />
            <Tab.Screen name='YeuThich' component={YeuThich} options={{
                tabBarIcon: ({focused,size,color}) => (
                    <Icon name='heart' size={25} color={focused ? '#8bd9bc':'#444343'}/>
                )

            }} />
            {/* <Tab.Screen name='ThongBao' component={ThongBao} options={{
                tabBarIcon: ({focused,size,color}) => (
                    <Icon name='bell' size={25} color={focused ? '#8bd9bc':'#444343'}/>
                )

            }} /> */}
            <Tab.Screen name='LienHe' component={LienHe} options={{
                tabBarIcon: ({focused,size,color}) => (
                    <Icon name='address-book' size={25} color={focused ? '#8bd9bc':'#444343'}/>
                )

            }} />


        </Tab.Navigator>

    )
}

export default BottomTab

const styles = StyleSheet.create({
    tabBarStyle:{
        height:60,
        position:'absolute',
        backgroundColor:'#E7E6E7',
        elevation:0,
        borderTopWidth:0,
        backgroundColor: 'rgba(173, 217, 204, 0.3)',
    }
})