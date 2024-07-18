import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useIsFocused, useNavigation } from '@react-navigation/native';

const ChiTietSP = ({ route }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { item } = route.params;
  const priceindex = item.prices[1]
  const [isPressed, setIsPressed] = useState(false);
  const [isFavourite, setIsFavourite] = useState(item.favourite);
  const [cart, setCart] = useState([]);

  const [selectedSize, setSelectedSize] = useState('Nhỏ');

  const handleSizeChange = (size) => {
    // Xử lý khi người dùng chọn size mới
    setSelectedSize(size);
  };

  // Tìm giá tương ứng với size đang được chọn
  const selectedPrice = item.prices.find((price) => price.size === selectedSize);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('http://192.168.223.168:3000/carts');
        const data = await response.json();
        setCart(data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, []);

  const handlePress = async () => {


    try {
      // Gửi yêu cầu cập nhật đến API
      const response = await fetch(`http://192.168.223.168:3000/products/${item.id}`, {
        method: 'PATCH', // hoặc 'POST' tùy thuộc vào API của bạn
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          favourite: !isFavourite,
        }),
      });

      if (response.ok) {
        // Cập nhật trạng thái "favourite" trong ứng dụng
        setIsFavourite(!isFavourite);
      } else {
        console.error('Failed to update favourite status');
      }
    } catch (error) {
      console.error('Error updating favourite status:', error);
    }
    setIsPressed(!isPressed);
  };
  const handlePressCart = async () => {

    const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.id);

    if (existingItemIndex !== -1) {
      // Nếu sản phẩm đã tồn tại, chỉ cần thêm size và price vào mảng prices của sản phẩm đó
      const updatedCart = [...cart];
      const existingItem = updatedCart[existingItemIndex];
      const existingSizeIndex = existingItem.prices.findIndex((price) => price.size === selectedSize);
      if (existingSizeIndex !== -1) {
        // Nếu size đã tồn tại, tăng số lượng của size đó
        existingItem.prices[existingSizeIndex].quantity += 1;
        existingItem.prices[existingSizeIndex].totalSize =
          parseFloat(existingItem.prices[existingSizeIndex].price) * existingItem.prices[existingSizeIndex].quantity;
      } else {
        // Nếu size chưa tồn tại, thêm size mới vào mảng prices của sản phẩm đó
        existingItem.prices.push({
          size: selectedSize,
          price: item.prices.find((price) => price.size === selectedSize)?.price || '',
          currency: item.prices.find((price) => price.size === selectedSize)?.currency || '₫',
          quantity: 1, // Đặt số lượng là 1 nếu thêm size mới
          totalSize: parseFloat(item.prices.find((price) => price.size === selectedSize)?.price) || 0,
        });
      }

      // Cập nhật giỏ hàng
      setCart(updatedCart);

      // Gửi yêu cầu PATCH để cập nhật giỏ hàng trên API
      try {
        const response = await fetch(`http://192.168.223.168:3000/carts/${existingItem.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(existingItem),
        });

        if (!response.ok) {
          console.error('Lỗi khi cập nhật giỏ hàng trên API');
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu cập nhật giỏ hàng:', error);
      }
    } else {
      // Nếu sản phẩm không tồn tại trong giỏ hàng, thêm sản phẩm mới vào giỏ hàng
      const newItem = {
        id: item.id,
        name: item.name,
        description: item.description,
        ingredients: item.ingredients,
        special_ingredient: item.special_ingredient,
        imagelink_square: item.imagelink_square,
        imagelink_portrait: item.imagelink_portrait,
        prices: [
          {
            size: selectedSize,
            price: item.prices.find((price) => price.size === selectedSize)?.price || '',
            currency: item.prices.find((price) => price.size === selectedSize)?.currency || '₫',
            quantity: 1, // Đặt số lượng là 1 nếu thêm sản phẩm mới
            totalSize: parseFloat(item.prices.find((price) => price.size === selectedSize)?.price) || 0,
          },
        ],
        average_rating: item.average_rating,
        ratings_count: item.ratings_count,
        favourite: item.favourite,
        type: item.type,
        index: item.index

      };

      // Cập nhật giỏ hàng
      setCart([...cart, newItem]);

      // Gửi yêu cầu POST để thêm sản phẩm mới vào giỏ hàng trên API
      try {
        const response = await fetch('http://192.168.223.168:3000/carts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newItem),
        });

        if (!response.ok) {
          console.error('Lỗi khi thêm sản phẩm vào giỏ hàng trên API');
        }
      } catch (error) {
        console.error('Lỗi khi gửi yêu cầu thêm sản phẩm vào giỏ hàng:', error);
      }
    }
  };
  return (

    <View style={{ flex: 1 }}>

      <View style={{ flex: 7 }}>

        <ImageBackground source={{ uri: item.imagelink_square }} style={{ width: '100%', height: '100%' }} />

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20, position: 'absolute', top: 0, width: '100%' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ borderRadius: 3, backgroundColor: '#8bd9bc', padding: 5, paddingHorizontal: 7 }}>
            <Icon name='arrow-left' size={28} color='white' />
          </TouchableOpacity>
          <TouchableOpacity style={{ borderRadius: 3, backgroundColor: '#8bd9bc', padding: 5 }} onPress={handlePress}>

            <Icon name='heart' size={28} color={isPressed || item.favourite ? '#bf3b84' : 'white'} />
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
          <View style={{ flex: 1 }}>

          </View>

        </View>

      </View>
      <View style={{ flex: 4, backgroundColor: '#718c49', padding: 20 }}>
        <Text style={{ color: 'white', fontSize: 20 }}>Mô tả</Text>
        <Text numberOfLines={3} ellipsizeMode="tail" style={{ color: 'white', fontSize: 15, marginTop: 10 }}>{item.description}</Text>
        <Text style={{ color: 'white', fontSize: 20, marginTop: 20, marginBottom: 10 }}>Size</Text>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={[
              styles.sizeButton,
              { backgroundColor: selectedSize === 'Nhỏ' ? '#bf3b84' : '#6F6F6E' },
            ]}
            onPress={() => handleSizeChange('Nhỏ')}
          >
            <Text style={{ color: 'white' }}>Nhỏ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sizeButton,
              { backgroundColor: selectedSize === 'Lớn' ? '#bf3b84' : '#6F6F6E' },
            ]}
            onPress={() => handleSizeChange('Lớn')}
          >
            <Text style={{ color: 'white' }}>Lớn</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 45 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, color: 'white' }}>   Giá</Text>
            <Text style={{ fontSize: 18, color: 'white', fontWeight: '700' }}>
              <Text style={{ color: '#bf3b84' }}>$</Text> {selectedPrice ? selectedPrice.price : ''}
            </Text>
          </View>
          <TouchableOpacity style={{ flex: 2, borderRadius: 10, backgroundColor: '#bf3b84', padding: 15, justifyContent: 'center', alignItems: 'center' }}
            onPress={handlePressCart}>
            <Text style={{ color: 'white' }}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  )
}

export default ChiTietSP

const styles = StyleSheet.create({
  sizeButton: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: '#6F6F6E',
    padding: 10,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
})