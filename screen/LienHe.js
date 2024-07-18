import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useRef, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';

const LienHe = () => {

  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const contentInputRef = useRef(null);

  const [name, setname] = useState('')
  const [email, setemail] = useState('')
  const [content, setcontent] = useState('')


  const onSubmit= () =>{
    let Contact={
      name: name,
      email: email,
      content: content
    };
    let url_contact = 'http://192.168.223.168:3000/contacts';
    fetch(url_contact,{
      method: 'POST',
      headers:{
        Accept: 'application/json',
        'Content-Type':'application/json',
      },
      body: JSON.stringify(Contact)
    }).then((res)=>{
      if(res.status==201)
        Alert.alert('Gửi thành công');
        nameInputRef.current.clear();
          emailInputRef.current.clear();
          contentInputRef.current.clear();
    }).catch((ex)=>{
      console.log(ex);
    })
  }

  return (
    <View>
      <View style={{  flexDirection: 'row', justifyContent:'space-between',padding:20 }}>
        <TouchableOpacity style={{borderRadius: 3, backgroundColor: '#8bd9bc', padding: 5, paddingHorizontal: 7}}>
          <Icon name='bars' size={28} color='white' />
        </TouchableOpacity>
        <TouchableOpacity style={{borderRadius: 3, backgroundColor: '#8bd9bc', padding: 5, paddingHorizontal: 8}}>
          <Icon name='user' size={28} color='white' />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
      <Text style={styles.label}>Họ Và Tên:</Text>
      <TextInput
        style={styles.khunginput}
        placeholder="Nhập Họ và Tên"
        ref={nameInputRef}
        onChangeText={(txt) => { setname(txt) }}
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.khunginput}
        placeholder="Nhập email VD: lephuongthuy0807@gmail.com"
        keyboardType="email-address"
        ref={emailInputRef}
        onChangeText={(txt) => { setemail(txt) }}
      />

      <Text style={styles.label}>Nội Dung:</Text>
      <TextInput
        style={[styles.khunginput, styles.messageInput]}
        placeholder="Type your message"
        multiline
        numberOfLines={4}
        ref={contentInputRef}
        onChangeText={(txt) => { setcontent(txt) }}
      />

      <TouchableOpacity style={styles.bgbutton} onPress={onSubmit}>
        <Text style={{ padding: 8, fontSize: 17, color: '#d5dcf2' }}>Send</Text>
      </TouchableOpacity>
    </View>
    </View>
  )
}

export default LienHe

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  khunginput: {
    borderColor: '#8bd9bc',
    borderWidth: 2,
    borderRadius: 2,
    padding: 7,
    margin: 5,
    marginHorizontal: 5,
    fontSize: 18,
  },
  messageInput: {
    height: 80,
  },
  bgbutton: {
    backgroundColor: '#718c49',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60%',
    alignSelf: 'center',
    borderRadius: 20,
    marginTop:20
  }
});