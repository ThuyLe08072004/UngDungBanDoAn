import React, { useState, useEffect } from 'react';
import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

const GioHang = (props) => {
  const navigation = useNavigation();

  const [isLoading, setIsLoading] = useState(true);
  const [dssp, setDssp] = useState([]);

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    dssp.forEach((product) => {
      product.prices.forEach((totalSize) => {
        totalPrice += totalSize.totalSize || 0;
      });
    });
    return totalPrice.toFixed(2);
  };

  const getListPro = async () => {
    let url_api = 'http://192.168.223.168:3000/carts';
    try {
      const response = await fetch(url_api);
      const json = await response.json();
      setDssp(json);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      getListPro();
    });
    return unsubscribe;
  }, [props.navigation]);

  const renderSize = (item, size) => {
    const priceInfo = item.prices.find(price => price.size === size);

    const handleMinusPress = async (item, size) => {
      try {
        const updatedDssp = [...dssp];
        const selectedItemIndex = updatedDssp.findIndex((product) => product.id === item.id);
        const selectedPriceIndex = updatedDssp[selectedItemIndex].prices.findIndex((p) => p.size === size);

        if (updatedDssp[selectedItemIndex].prices[selectedPriceIndex].quantity > 0) {
          const newQuantity = updatedDssp[selectedItemIndex].prices[selectedPriceIndex].quantity - 1;

          await fetch(`http://192.168.223.168:3000/carts/${item.id}/sizes/${size}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity: newQuantity }),
          });

          const product = updatedDssp[selectedItemIndex];
          const productPrice = parseFloat(product.prices[selectedPriceIndex].price);
          const newTotalPrice = productPrice * newQuantity;

          updatedDssp[selectedItemIndex].prices[selectedPriceIndex].quantity = newQuantity;
          updatedDssp[selectedItemIndex].prices[selectedPriceIndex].totalSize = newTotalPrice;

          setDssp(updatedDssp);
        }
      } catch (error) {
        console.error(error);
      }
    };

    const handlePlusPress = async (item, size) => {
      try {
        const updatedDssp = [...dssp];
        const selectedItemIndex = updatedDssp.findIndex((product) => product.id === item.id);
        const selectedPriceIndex = updatedDssp[selectedItemIndex].prices.findIndex((p) => p.size === size);

        await fetch(`http://192.168.223.168:3000/carts/${item.id}/sizes/${size}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity: updatedDssp[selectedItemIndex].prices[selectedPriceIndex].quantity + 1 }),
        });

        const product = updatedDssp[selectedItemIndex];
        const productPrice = parseFloat(product.prices[selectedPriceIndex].price);
        const newQuantity = product.prices[selectedPriceIndex].quantity + 1;
        const newTotalPrice = productPrice * newQuantity;

        updatedDssp[selectedItemIndex].prices[selectedPriceIndex].quantity = newQuantity;
        updatedDssp[selectedItemIndex].prices[selectedPriceIndex].totalSize = newTotalPrice;

        setDssp(updatedDssp);
      } catch (error) {
        console.error(error);
      }
    };

    if (priceInfo && priceInfo.quantity > 0) {
      return (
        <View key={size} style={styles.sizeContainer}>
          <View style={styles.sizeBox}>
            <Text style={styles.sizeText}>{size}</Text>
          </View>
          <Text style={styles.totalSizeText}><Text style={styles.dollarText}>$</Text> {priceInfo.totalSize}</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => handleMinusPress(item, size)}>
            <Icon name='minus' size={15} color='white' />
          </TouchableOpacity>
          <View style={styles.quantityBox}>
            <Text style={styles.quantityText}>{priceInfo.quantity}</Text>
          </View>
          <TouchableOpacity style={styles.iconButton} onPress={() => handlePlusPress(item, size)}>
            <Icon name='plus' size={15} color='white' />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  const clearCartOnServer = async () => {
    try {
      await Promise.all(
        dssp.map(async (product) => {
          const { id } = product;
          const response = await fetch(`http://192.168.223.168:3000/carts/${id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (!response.ok) {
            console.error(`Failed to delete product ${id} from the cart.`);
          }
        })
      );
      setDssp([]);
    } catch (error) {
      console.error('Error clearing cart on server:', error);
    }
  };

  const postProductsToServer = async () => {
    try {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

      const productsWithDate = dssp.map(product => ({
        ...product,
        date: formattedDate,
        totalAmount: calculateTotalPrice()
      }));

      const productsObject = productsWithDate.reduce((acc, product) => {
        const { id, ...rest } = product;
        acc[id] = { ...rest, date: product.date };
        return acc;
      }, {});

      const response = await fetch('http://192.168.223.168:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productsObject),
      });

      if (response.ok) {
        console.log('Products posted successfully!');
        clearCartOnServer();
      } else {
        console.error('Failed to post products:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error posting products:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name='bars' size={28} color='white' />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerButton}>
          <Icon name='user' size={28} color='white' />
        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        <View style={styles.divider}></View>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={dssp}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.productContainer}>
                <View style={styles.productHeader}>
                  <Image style={styles.productImage} source={{ uri: item.imagelink_square }} />
                  <View style={styles.productInfo}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.productName}>{item.name}</Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.productIngredients}>{item.ingredients}</Text>
                  </View>
                </View>
                {item.prices.map(price => renderSize(item, price.size))}
              </View>
            )}
            style={styles.productList}
          />
        )}
        <View style={styles.footer}>
          <View style={styles.totalPriceContainer}>
            <Text style={styles.totalPriceLabel}>Total Price</Text>
            <Text style={styles.totalPriceValue}>$ {calculateTotalPrice()}</Text>
          </View>
          <TouchableOpacity onPress={postProductsToServer} style={styles.payButton}>
            <Text style={styles.payButtonText}>Pay</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider}></View>
      </View>
    </View>
  );
};

export default GioHang;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#8bd9bc',
  },
  headerButton: {
    borderRadius: 3,
    backgroundColor: '#8bd9bc',
    padding: 5,
    paddingHorizontal: 7,
  },
  body: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#8bd9bc',
  },
  productContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    margin: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  productHeader: {
    flexDirection: 'row',
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    borderRadius: 10,
    margin: 10,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  productIngredients: {
    fontSize: 16,
    color: '#555',
  },
  productList: {
    flexGrow: 0,
  },
  sizeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  sizeBox: {
    width: 80,
    backgroundColor: '#8bd9bc',
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  sizeText: {
    color: 'black',
    fontWeight: '800',
  },
  totalSizeText: {
    fontSize: 18,
    color: 'black',
    fontWeight: '800',
  },
  dollarText: {
    color: '#bf3b84',
  },
  iconButton: {
    borderRadius: 5,
    backgroundColor: '#bf3b84',
    padding: 7,
    paddingHorizontal: 9,
  },
  quantityBox: {
    flexDirection: 'row',
    borderColor: '#bf3b84',
    borderWidth: 1,
    width: 70,
    height: 35,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    color: 'black',
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#8bd9bc',
  },
  totalPriceContainer: {
    flex: 1,
    alignItems: 'center',
  },
  totalPriceLabel: {
    fontSize: 18,
    color: 'black',
    fontWeight: '500',
  },
  totalPriceValue: {
    color: '#bf3b84',
    fontSize: 18,
    fontWeight: '500',
  },
  payButton: {
    backgroundColor: '#bf3b84',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  payButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
});
