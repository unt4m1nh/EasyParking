import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Dimensions,
  Modal,
} from 'react-native';
import {
  useCameraPermission,
  useCameraDevice,
  Camera,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {useSharedValue} from 'react-native-worklets-core';
import LinearGradient from 'react-native-linear-gradient';
import {crop} from 'vision-camera-cropper';
import {io} from 'socket.io-client';

function CameraFeature() {
  const deviceWidth = Dimensions.get('window').width;
  const deviceHeight = Dimensions.get('window').height;
  const device = useCameraDevice('back');
  if (device == null) return <Text>No device found !</Text>;
  // Hooks API granting CAMERA permission
  const {hasPermission, requestPermission} = useCameraPermission();
  // Setting up device camera
  // Request Camera Permission from Android system
  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  const [serverMessage, setServerMessage] = useState(null);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const frameData = useSharedValue([1, 2]);
  const theme = useColorScheme();

  const vehicleWidth = 184;

  // Connect socket

  useEffect(() => {
    const socket = io('http://18.140.116.38:5000', {
      transports: ['websocket'],
    });
    console.log(socket);
    socket.on('connect', () => {
      console.log('Connected', socket.connected);
    });

    socket.on('connect_error', err => {
      console.error(`connect_error due to ${err}`);
    });
    let sendFrame = setInterval(() => {
      console.log('Frame is sent');
      socket.emit('frame', {
        data: frameData.value.base64,
      });
    }, 2000);
    socket.on('response', data => {
      console.log(data);
      setServerMessage(data.data);
      console.log('Result is received');
      console.log(serverMessage);
    });

    return () => {
      socket.disconnect();
      clearInterval(sendFrame);
    };
  }, []);

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const cropRegion = {
      left: 0,
      top: 0,
      width: 100,
      height: 100,
    };
    const result = crop(frame, {
      cropRegion: cropRegion,
      includeImageBase64: true,
      saveAsFile: false,
    });
    frameData.value = result;
  }, []);

  return (
    <View style={styles.background}>
      {/* Camera View */}

      <Camera
        style={{width: '100%', height: '100%'}}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
      />

      {/* Modal View */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.textDark}>{messageType}</Text>
            <Text style={styles.textDarkRegular}>{message}</Text>
            <LinearGradient
              colors={['#CEC9F2', '#B1B1F1', '#9C9FF0']}
              style={styles.closeBtn}>
              <TouchableOpacity
                onPress={() => setModalVisible(!modalVisible)}
                style={{
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text style={styles.textLight}>Đóng</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>
      <View style={styles.resultContainer}>
        <Text style={styles.textDark}>
          {' '}
          {serverMessage === '' ? '' : 'Khoảng cách giũa 2 xe phía trước'}
        </Text>
        <Text
          style={{
            ...styles.textAlert,
            color: serverMessage > vehicleWidth ? 'green' : 'red',
          }}>
          {serverMessage === ''
            ? 'Không xác định được phương tiện'
            : serverMessage}
        </Text>
        {serverMessage !== '' ? (
          <Text
            style={{
              ...styles.textAlert,
              color: serverMessage > vehicleWidth ? 'green' : 'red',
            }}>
            {serverMessage > vehicleWidth ? 'Vừa' : 'Không vừa'}
          </Text>
        ) : (
          ''
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    position: 'relative',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
  },
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalView: {
    display: 'flex',
    width: '80%',
    gap: 36,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    gap: 10,
    padding: 24,
  },
  resultContainer: {
    width: '90%',
    height: '10%',
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    top: '5%',
    left: '5%',
    textAlign: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    borderRadius: 10,
  },
  textRegular: {
    fontSize: 14,
    color: '#212121',
    fontFamily: 'Urbanist-Regular',
    alignSelf: 'center',
    textAlign: 'center',
  },
  textLight: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Urbanist-Regular',
  },
  textDark: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#212121',
    fontFamily: 'Urbanist-Regular',
  },
  textDarkRegular: {
    fontSize: 10,
    color: '#212121',
    fontFamily: 'Urbanist-Regular',
  },
  textHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'Urbanist-Regular',
    color: '#212121',
  },
  textHeadingPurple: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'Urbanist-Regular',
    color: '#9A9DF0',
  },
  textAlert: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  error: {
    color: 'red',
    fontSize: 13,
    marginTop: 50,
  },
  input: {
    width: '100%',
    height: 60,
    backgroundColor: '#F8F7FD',
    borderRadius: 10,
    marginTop: 10,
    color: '#212121',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    gap: 10,
  },
  rememberBtn: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 16,
  },
  signInBtn: {
    backgroundColor: '#9C9FF0',
    alignItems: 'center',
    justifyContent: 'center',
    height: 58,
    borderRadius: 10,
    marginTop: 24,
  },
  closeBtn: {
    width: '100%',
    height: 48,
    borderRadius: 10,
  },
  submitBtn: {
    position: 'absolute',
    bottom: 16,
    left: 24,
    width: '90%',
    backgroundColor: '#9C9FF0',
    alignItems: 'center',
    justifyContent: 'center',
    height: 58,
    borderRadius: 10,
    marginTop: 24,
  },
  codeDigit: {
    width: 78,
    height: 61,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F7FD',
    borderRadius: 10,
  },
  numpad: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 272,
    backgroundColor: '#F1F2FF',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  numrow: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
  },
  num: {
    width: '33%',
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    alignSelf: 'center',
    resizeMode: 'contain',
  },
});

export default CameraFeature;
