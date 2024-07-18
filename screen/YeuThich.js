import { FlatList, Image, StyleSheet, Text, View, TextInput, TouchableOpacity, ImageBackground, Alert } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import { ActivityIndicator } from 'react-native';

const YeuThich = (props) => {
  const [favorite, setfavorite] = useState([]);
  const [isPressed, setIsPressed] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [index, setIndex] = useState(0);
  

  const handlePress = async (index) => {

    const updateFavorite = [...favorite];
    

    updateFavorite[index].favourite = !updateFavorite[index].favourite;
    
    let url_api = `http://192.168.223.168:3000/products/${updateFavorite[index].id}`;
    try{
      const respone = await fetch(url_api,{
        method:'PATCH',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          favourite: updateFavorite[index].favourite,
        }),
      });

      if(!respone.ok){
        throw new Error('Failed to update favorite status');
      }

      
    setIsPressed(index);

    setfavorite(updateFavorite);
    Alert.alert('Đã loại bỏ khỏi danh sách yêu thích')
  
      
    }catch (error){
      console.error(error);
    }
    
  };

  const getFavoriteList = async () => {
    let url_api = 'http://192.168.223.168:3000/products';
    try {
      const respone = await fetch(url_api);

      const json = await respone.json();
      const favoritelist = json.filter((love) => love.favourite === true)

      setfavorite(favoritelist)

    } catch (error) {
      console.error(error);
    } finally {
      setisLoading(false);
    }
  }

  React.useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getFavoriteList();
    });
    return unsubscribe;
  }, [props.navigation]);

  return (
    <View style={{ flex: 1, }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
        <TouchableOpacity style={{ borderRadius: 3, backgroundColor: '#8bd9bc', padding: 5, paddingHorizontal: 7 }}>
          <Icon name='bars' size={28} color='white' />
        </TouchableOpacity>
        <TouchableOpacity style={{ borderRadius: 3, backgroundColor: '#8bd9bc', padding: 5, paddingHorizontal: 8 }}>
          <Icon name='user' size={28} color='white' />
        </TouchableOpacity>
      </View>
      <View style={{}}>
        <View style={{
          borderColor: '#8bd9bc',
          borderWidth: 2,
          borderRadius: 10,
          flexDirection: 'row',
          fontSize: 18,
          alignItems: 'center',
          marginHorizontal: 10,
          paddingHorizontal: 10,
          height: 40
        }}>
          <Icon name='search' size={20} color='black' />
          <TextInput

            keyboardType='default'
            style={{ marginHorizontal: 10, alignItems: 'center' }}
          />
        </View>
        <Text style={{
          fontSize: 25,
          margin: 5,
          color: 'black',
          fontWeight: 'bold'
        }}>Món ăn yêu thích</Text>
        <View style={{
        }}>
          <View style={{
            height: 600,
          }}>

            <View style={{ height: 1, backgroundColor: '#8bd9bc' }}></View>{
              (isLoading) ? (
                <ActivityIndicator />
              ) : (
                <FlatList
                  data={favorite}
                  keyExtractor={item => item.id}
                  renderItem={({ item, index }) => {
                    return <View style={{ height:500, margin:10, }}>

                    <View style={{ flex: 8, }}>
                      
                      <ImageBackground source={{ uri: item.imagelink_square }} style={{ width: '100%', height: '100%' }} />
                      
                      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', padding: 20,position:'absolute',top:0,width:'100%' }}>
                      
                      <TouchableOpacity style={{ borderRadius: 3, backgroundColor: '#8bd9bc', padding: 5 }} onPress={() => handlePress(index)}>
                        
                        <Icon name='heart' size={28} color={isPressed === index || item.favourite ? '#bf3b84':'white'} />
                      </TouchableOpacity>
                    </View>
                      <View style={{
                        width: '100%',
                        height: 150,
                        backgroundColor: 'rgba(113, 140, 73, 0.5)',
                        position: 'absolute',
                        bottom: 0,
                        borderTopRightRadius: 30,
                        borderTopStartRadius: 30,
                        flexDirection: 'row'
                      }}>
                        <View style={{ flex: 1, padding: 20 }}>
                          <Text style={{ color: 'white', fontSize: 27, fontWeight: '600' }}>{item.name}</Text>
                          <Text style={{ color: 'white', fontSize: 15 }}>{item.special_ingredient}</Text>
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 30 }}>
                            <Icon name='star' size={20} color={'yellow'} />
                            <Text style={{ color: 'white', fontSize: 17, fontWeight: '600' }}> {item.average_rating}</Text>
                            <Text style={{ color: 'white', fontSize: 12 }}> ({item.ratings_count})</Text>
                          </View>
              
                        </View>
                    
              
                      </View>
              
                    </View>
                    <View style={{ flex: 2, backgroundColor: '#718c49', padding: 20 }}>
                      <Text style={{ color: 'white', fontSize: 20 }}>Mô tả</Text>
                      <Text numberOfLines={3} ellipsizeMode="tail" style={{ color: 'white', fontSize: 15, marginTop: 10 }}>{item.description}</Text>
                      
                      
                      
              
                    </View>
                  </View>
                  }}
                  style={{ flex: 1, }}>

                </FlatList>
              )
            }



            <View style={{ height: 1, backgroundColor: '#8bd9bc' }}></View>


          </View>
        </View>

      </View>

    </View>
  )
}

export default YeuThich

const styles = StyleSheet.create({
  khunginput: {
    borderColor: '#8bd9bc',
    borderWidth: 2,
    borderRadius: 10,
    padding: 7,
    margin: 5,
    marginHorizontal: 10,
    fontSize: 18,
    marginTop: 20
  },
})