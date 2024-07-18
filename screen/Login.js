import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Image,
    TouchableOpacity,
    ImageBackground,
    KeyboardAvoidingView,
    Keyboard,
    ScrollView,
    Alert
} from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import('@react-navigation/native-stack')

const Login = ({ navigation }) => {
    
    const [email, setemail] = useState('')
    const [password, setPassword] = useState('');
    const [secureTextEntry, setSecureTextEntry] = useState(true);


    const doLogin = () => {
        if (email.length == 0) {
            Alert.alert("Chưa nhập Username");
            return;
        }
        if (password.length == 0) {
            Alert.alert("Chưa nhập Password");
            return;
        }

        let url_user_login = "http://192.168.223.168:3000/users?email=" + email;



        fetch(url_user_login)
            .then((res) => {
                return res.json();
            })
            .then( async (res_login) => {
                if (res_login.length != 1){
                    Alert.alert("Sai email hoặc lỗi trùng lặp");
                    return;
                }else{
                    let objU = res_login[0];
                    if(objU.password != password){
                        Alert.alert("Sai pass");
                    }else{
                        try {
                            await AsyncStorage.setItem('loginInfo',JSON.stringify(objU));
                            navigation.navigate('BottomTab');
                        } catch (e) {
                            console.log(e);
                        }
                    }
                }
        })


    }

    const toggleSecureTextEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };
    return (
        <View style={{ backgroundColor: 'white', flex: 1 }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ScrollView style={{ flex: 1 }}>

                    <View style={{ flex: 30, alignItems: 'center', justifyContent: 'center', marginTop: 70 }}>
                        <Image source={require('../assets/image/logo.png')} style={styles.image} />
                        <Text style={{ fontSize: 25, color: 'black', textAlign: 'center', }}>Welcome to app </Text>
                        <Text style={{ fontSize: 15, textAlign: 'center', }}>Login to continue </Text>

                    </View>
                    <View style={{ flex: 20, marginTop: 50 }}>

                        <View style={{
                            flexDirection: 'row', borderColor: '#8bd9bc',
                            borderBottomWidth: 1,
                            margin: 5,
                            marginHorizontal: 10,
                            fontSize: 18,
                            paddingLeft: 5
                        }}>
                            <TouchableOpacity
                                style={{ alignSelf: 'center', marginRight: 10 }}>
                                <Icon name="user" size={18} color="#8bd9bc" />
                            </TouchableOpacity>
                            <TextInput
                                style={{width:'80%'}}
                                placeholder='Email'
                                onChangeText={(txt)=>{setemail(txt)}}
                            />

                        </View>
                        <View style={{
                            flexDirection: 'row', borderColor: '#8bd9bc',
                            borderBottomWidth: 1,
                            margin: 5,
                            marginHorizontal: 10,
                            fontSize: 18,
                            paddingHorizontal: 5
                        }}>
                            <TouchableOpacity
                                style={{ alignSelf: 'center', marginRight: 10 }}>
                                <Icon name="lock" size={18} color="#8bd9bc" />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '95%' }}>
                                <TextInput
                                    secureTextEntry={secureTextEntry}
                                    keyboardType='default'
                                    placeholder='Password'
                                    style={{width:'80%'}}
                                    onChangeText={(text) => setPassword(text)}
                                    value={password}
                                />
                                <TouchableOpacity
                                    title={secureTextEntry ? 'Show Password' : 'Hide Password'}
                                    onPress={toggleSecureTextEntry}
                                    style={{ alignSelf: 'center', marginRight: 3 }}>
                                    <Icon name="eye" size={20} color="#8bd9bc" />
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>

                    <View style={{ flex: 15, marginTop: 30 }}>
                        <TouchableOpacity style={styles.bgbutton} onPress={doLogin}>
                            <Text style={{ padding: 8, fontSize: 17, color: '#d5dcf2' }}>Sign In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={{ padding: 8, fontSize: 13, alignSelf: 'center' }}>Don't have acount? Click<Text style={{ color: '#bf3b84', fontSize: 15 }}> Register</Text> </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ flex: 25, marginTop: 20 }}>
                        <View style={{
                            height: 40,
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginHorizontal: 20
                        }}>
                            <View style={{
                                height: 1,
                                backgroundColor: 'black',
                                flex: 1
                            }}></View>
                            <Text style={{
                                padding: 8,
                                fontSize: 14,
                                alignSelf: 'center',
                                color: 'black',
                                marginHorizontal: 5
                            }}>Use other methods?</Text>
                            <View style={{
                                height: 1,
                                backgroundColor: 'black',
                                flex: 1
                            }}></View>
                        </View>
                        <TouchableOpacity style={{
                            borderColor: 'black',
                            borderWidth: 2,
                            borderRadius: 5,
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '60%',
                            alignSelf: 'center',
                            borderRadius: 20,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                            <Text style={{ padding: 8, fontSize: 15, color: 'black' }}>Sign In with Google </Text>
                            <Image source={require('../assets/icon/google.png')} style={{ width: 20, height: 20, marginHorizontal: 10 }} />

                        </TouchableOpacity>

                    </View>






                </ScrollView>
            </KeyboardAvoidingView>
        </View>


    )
}

export default Login

const styles = StyleSheet.create({
    image: { width: 300, height: 150, alignItems: 'center' },
    khunginput: {
        borderColor: '#8bd9bc',
        borderWidth: 2,
        borderRadius: 10,
        padding: 7,
        margin: 5,
        marginHorizontal: 10,
        fontSize: 18,
    },
    bgbutton: {
        backgroundColor: '#718c49',
        alignItems: 'center',
        justifyContent: 'center',
        width: '60%',
        alignSelf: 'center',
        borderRadius: 20,
    }
});
