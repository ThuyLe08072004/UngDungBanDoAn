import { FlatList, Image, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const Home = (props) => {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [dssp, setDssp] = useState([]);
  const [topFoods, setTopFoods] = useState([]);

  // Hàm load sản phẩm
  const getListPro = async () => {
    let url_api = 'http://192.168.223.168:3000/products';

    try {
      const response = await fetch(url_api); // Load dữ liệu

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json(); // Chuyển dữ liệu thành json
      setDssp(json); // Đổ dữ liệu
    } catch (error) {
      console.error('Error fetching product list:', error);
      Alert.alert('Error', 'Could not load products. Please try again later.');
    } finally {
      // Kết thúc quá trình load dữ liệu
      setIsLoading(false); // Trạng thái không còn load nữa
    }
  };

  const getTopList = async () => {
    let url_api = 'http://192.168.223.168:3000/products';

    try {
      const response = await fetch(url_api);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();
      const top7Foods = json.sort((a, b) => b.ratings_count - a.ratings_count).slice(0, 7);
      setTopFoods(top7Foods);
    } catch (error) {
      console.error('Error fetching top food list:', error);
      Alert.alert('Error', 'Could not load top foods. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      // Cập nhật giao diện ở đây
      getListPro();
      getTopList();
    });

    return unsubscribe;
  }, [props.navigation]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20 }}>
        <TouchableOpacity style={{ borderRadius: 3, backgroundColor: '#8bd9bc', padding: 5, paddingHorizontal: 7 }}>
          <Icon name='bars' size={28} color='white' />
        </TouchableOpacity>
        <TouchableOpacity style={{ borderRadius: 3, backgroundColor: '#8bd9bc', padding: 5, paddingHorizontal: 8 }}>
          <Icon name='user' size={28} color='white' />
        </TouchableOpacity>
      </View>

      <View>
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.menuLoai}
        >
        </ScrollView>

        <Text style={{
          fontSize: 25,
          margin: 5,
          color: 'black',
          fontWeight: 'bold'
        }}>Món ăn mới</Text>
        <View>
          <View style={{ height: 230 }}>
            <View style={{ height: 1, backgroundColor: '#8bd9bc' }}></View>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <FlatList
                horizontal
                data={dssp}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                  const priceindex = item.prices[1];
                  return (
                    <View style={{
                      backgroundColor: '#add9cc',
                      borderRadius: 10,
                      margin: 5,
                      padding: 5,
                      width: 130
                    }}>
                      <Image
                        style={{
                          width: 100,
                          height: 100,
                          resizeMode: 'cover',
                          borderRadius: 10,
                          margin: 10
                        }}
                        source={{
                          uri: item.imagelink_square
                        }}
                      />
                      <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>{item.name}</Text>
                      <Text numberOfLines={1} ellipsizeMode="tail">{item.description}</Text>
                      <View style={{ flex: 1, alignItems: 'flex-end', padding: 4, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 18 }}><Text style={{ color: 'red' }}>$</Text>{priceindex.price}</Text>
                        <TouchableOpacity style={{ borderRadius: 3, backgroundColor: '#718c49', padding: 3, paddingHorizontal: 4 }} onPress={() => { navigation.navigate('ChiTietSP', { item }) }}>
                          <Icon name='plus' size={15} color='white' />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }}
                style={{ flex: 1 }}
              />
            )}
            <View style={{ height: 1, backgroundColor: '#8bd9bc' }}></View>
          </View>
        </View>
        <Text style={{
          fontSize: 25,
          margin: 5,
          color: 'black',
          fontWeight: 'bold',
          marginTop: 20
        }}>Món ăn bán chạy</Text>

        <View>
          <View style={{ height: 230 }}>
            <View style={{ height: 1, backgroundColor: '#8bd9bc' }}></View>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <FlatList
                horizontal
                data={topFoods}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                  const priceindex = item.prices[1];
                  return (
                    <View style={{
                      backgroundColor: '#add9cc',
                      borderRadius: 10,
                      margin: 5,
                      padding: 5,
                      width: 130
                    }}>
                      <Image
                        style={{
                          width: 100,
                          height: 100,
                          resizeMode: 'cover',
                          borderRadius: 10,
                          margin: 10
                        }}
                        source={{
                          uri: item.imagelink_square
                        }}
                      />
                      <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 20, fontWeight: 'bold', color: 'black' }}>{item.name}</Text>
                      <Text numberOfLines={1} ellipsizeMode="tail">{item.description}</Text>
                      <View style={{ flex: 1, alignItems: 'flex-end', padding: 4, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 18 }}><Text style={{ color: 'red' }}>$</Text>{priceindex.price}</Text>
                        <TouchableOpacity style={{ borderRadius: 3, backgroundColor: '#718c49', padding: 3, paddingHorizontal: 4 }} onPress={() => { navigation.navigate('ChiTietSP', { item }) }}>
                          <Icon name='plus' size={15} color='white' />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }}
                style={{ flex: 1 }}
              />
            )}
            <View style={{ height: 1, backgroundColor: '#8bd9bc' }}></View>
          </View>
        </View>
      </View>
    </View>
  );
}

export default Home;

const styles = StyleSheet.create({
  khunginput: {
    borderColor: '#8bd9bc',
    borderWidth: 2,
    borderRadius: 10,
    padding: 7,
    margin: 5,
    fontSize: 18,
  },
});
