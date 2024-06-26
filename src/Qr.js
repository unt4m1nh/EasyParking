import React, {useState, useEffect, useContext} from 'react';
import {
  Text,
  View,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import QRCode from 'react-native-qrcode-svg';
import {useUserState} from '../component/UserContext';
import LinearGradient from 'react-native-linear-gradient';

function QrScreen({navigation}) {
  const theme = useColorScheme();

  const {userContext, setUserContext} = useUserState();

  const [qrData, setQRData] = useState('1');
  const [showQrCode, setShowQrCode] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [showSpinner, setShowSpinner] = useState(false);
  const [session, setSession] = useState({});

  // function to fetch session data
  const sessionData = () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(
      `${process.env.API_URL}/getSession/${userContext.idUser}`,
      requestOptions,
    )
      .then(response => response.json())
      .then(result => {
        console.log(result);
        setSession(result);
      })
      .catch(error => console.log(error));
  };

  const cancelBooking = () => {
    console.log(session.sessionId);
    var requestBody = {
      User: userContext.idUser,
      sessionId: session.sessionId,
    };
    var requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    };
    console.log(process.env.URL_BOOKING);
    const url = `${process.env.URL_BOOKING}/app3/cancel`;
    setShowSpinner(true);
    fetch(url, requestOptions)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Yêu cầu thất bại.');
        }
      })
      .then(data => {
        console.log('Yêu cầu thành công:');
        console.log(data);
        setShowSpinner(false);
    })
    .catch(error => {
        console.error('Lỗi:', error);
        setShowSpinner(false);
      })
  };

  const generateRandomString = length => {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return userContext.idUser + result;
  };

  const generateQRCode = () => {
    const data = generateRandomString(10);
    const qrCode = 'ndd12345' + data;
    setQRData(qrCode);
    setShowQrCode(true);
  };

  useEffect(() => {
    if (userContext.booking === 1 && !isGenerated) {
      generateQRCode();
      setIsGenerated(true);
    } else if (userContext.booking === 0) {
      setIsGenerated(false);
      setShowQrCode(false);
    }
  }, [userContext]);

  useEffect(() => {
    sessionData();
  }, [userContext]);

  if (showSpinner) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme == 'dark' ? '#000' : 'white',
        width: '100%',
        height: '100%',
      }}>
      {!showQrCode ? (
        <Text style={styles.textBold}>
          Mã QR chỉ có thể tạo khi bạn đã đặt chỗ
        </Text>
      ) : (
        <View style={styles.container}>
          <Text style={styles.text}>
            Hãy đưa mã QR này trước máy Scan ở cửa ra vào bãi xe
          </Text>
          <View style={styles.qr}>
            <QRCode value={qrData} size={256} />
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.info}>
              <Text style={styles.text}>Chủ phương tiện</Text>
              <Text style={styles.textBold}>
                {session?.name ?? 'Đang tải ...'}
              </Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.text}>Tên phương tiện</Text>
              <Text style={styles.textBold}>
                {session?.vehicle ?? 'Đang tải ...'}
              </Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.text}>Tên bãi xe</Text>
              <Text style={styles.textBold}>
                {session?.parking ?? 'Đang tải ...'}
              </Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.text}>Ví trí ô đỗ</Text>
              <Text style={styles.textBold}>
                {session?.slot ?? 'Đang tải ...'}
              </Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.text}>Thời gian</Text>
              <Text style={styles.textBold}>
                {session?.timeBooking ?? 'Đang tải ...'}
              </Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.text}>Ngày</Text>
              <Text style={styles.textBold}>
                {session?.date ?? 'Đang tải ...'}
              </Text>
            </View>
          </View>
          <LinearGradient
            colors={['#CEC9F2', '#B1B1F1', '#9C9FF0']}
            style={styles.updateBtn}>
            <TouchableOpacity
              onPress={() => {
                cancelBooking();
              }}
              style={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.textLight}>Hủy đặt chỗ</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: '#EEEEEE',
    alignItems: 'center',
    padding: 16,
  },
  qr: {
    marginTop: 16,
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    maxWidth: 200,
    fontSize: 14,
    fontFamily: 'Urbanist-Regular',
    textAlign: 'center',
    color: '#212121',
  },
  textBold: {
    fontSize: 16,
    fontFamily: 'Urbanist-Regular',
    textAlign: 'center',
    color: '#212121',
    fontWeight: 'bold',
  },
  textTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  textLarge: {
    fontSize: 18,
    color: '#424242',
    fontWeight: '600',
  },
  textLargeRed: {
    fontSize: 18,
    color: '#F75555',
    fontWeight: '600',
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
  textSmall: {
    fontSize: 14,
    color: '#212121',
  },
  updateBtn: {
    width: '100%',
    height: 48,
    margin: 16,
    borderRadius: 10,
  },
  infoContainer: {
    width: '90%',
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
    flexWrap: 'wrap',
  },
  info: {
    width: 117,
    alignItems: 'flex-start',
  },
});

export default QrScreen;
