import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import CameraFeature from './CameraFeature';

function CameraScreen({navigation}) {
  const [show, setShow] = useState(false);
  return (
    <View style={styles.container}>
      {show ? (
        <CameraFeature />
      ) : (
        <Text style={styles.textDarkRegular}>
          Ấn nút phía dưới để bật chế độ đỗ xe ngoài trời
        </Text>
      )}
      <LinearGradient
        colors={['#CEC9F2', '#B1B1F1', '#9C9FF0']}
        style={styles.btn}>
        <TouchableOpacity
          onPress={() => {
            console.log('Button clicked');
            setShow(!show);
          }}
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.textLight}>
            {show ? 'Tắt Camera' : 'Bật Camera'}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    position: 'absolute',
    left: '30%',
    top: '80%',
    width: '40%',
    height: 50,
    backgroundColor: 'red',
  },
  textLight: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Urbanist-Regular',
  },
  textDark: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    fontFamily: 'Urbanist-Regular',
  },
  textDarkRegular: {
    fontSize: 16,
    color: '#212121',
    fontFamily: 'Urbanist-Regular',
  },
});

export default CameraScreen;
