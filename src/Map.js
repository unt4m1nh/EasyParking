import React, { useEffect, useState, useRef } from 'react';
import {
    Text,
    TextInput,
    View,
    StyleSheet,
    TouchableOpacity,
    PermissionsAndroid,
    ScrollView,
    Image,
    Modal,
} from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Polyline, Callout, Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome'
import Tts from 'react-native-tts';
import Geolocation from 'react-native-geolocation-service';
import data from '../backend/data.json';
import DatePicker from 'react-native-date-picker'
import LinearGradient from 'react-native-linear-gradient';
import DynamicText from './DynamicText';
import { useUserState } from '../component/UserContext';

function MapScreen({ navigation }) {

    const { userContext, setUserContext } = useUserState();
    // useStaae variables for detecting places coordinates
    const [currentLongtitude, setCurrentLongtitude] = useState(0);
    const [currentLatitude, setCurrentLatitude] = useState(0);
    const [desLat, setDesLat] = useState(0);
    const [desLng, setDesLng] = useState(0);
    const [posLat, setPosLat] = useState(null);
    const [posLng, setPosLng] = useState(null);

    // useState variables for routing function
    const [routes, setRoutes] = useState([]);
    const [distance, setDistance] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [instructionsArray, setInstructionsArray] = useState([]);

    // Storing parking places' details
    const [pData, setPdata] = React.useState({
        nameParking: '',
        address: '',
        status: '',
        price: '',
        slotLeft: '',
        distance: '',
        duration: '',
    })
    const [slot, setSlot] = useState(null);
    const [parking, setParking] = useState(null);

    // Storing data for places autocomplate function
    const [inputValue, setInputValue] = useState('');
    const [predictions, setPredictions] = useState([]);

    // useState variables for hiding and showing components
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [showPredictions, setShowPredictions] = useState(false);
    const [showMarker, setShowMarker] = useState(false);
    const [chosen, setChosen] = useState(false);
    const [booking, setBooking] = useState(false);
    const [userStatus, setUserStatus] = useState(false);
    const [showDirection, setShowDirection] = useState(false);
    const [show, setShow] = useState(false);
    const [showRoutes, setShowRoutes] = useState(false);
    const [showParkingStatus, setShowParkingStatus] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const mapViewRef = useRef(null);

    //Date Picker variables
    const [date, setDate] = useState(new Date());
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [timeCheckin, setTimeCheckin] = useState(new Date())
    const [openTimeInPicker, setOpenTimeInPicker] = useState(false)
    const [timeCheckout, setTimeCheckout] = useState(new Date())
    const [openTimeOutPicker, setOpenTimeOutPicker] = useState(false)

    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);
    const [token, setToken] = useState(null);
    const [id, setUid] = useState(null);

    //Fit screen values
    const edgePaddingValue = 70;

    //Functions
    Tts.setDefaultLanguage('vi-VN');
    Tts.setDefaultVoice('vi-VN-language');

    const retrieveToken = async () => {
        try {
            const authToken = await AsyncStorage.getItem('authToken');
            return authToken;
        } catch (error) {
            console.error('Error retrieving token:', error);
            return null;
        }
    };

    retrieveToken().then((storedToken) => {
        if (storedToken) {
            // Use the stored token for authentication
            setToken(storedToken);
        } else {
            // Token not available or retrieval failed
        }
    });

    const getUserInfo = () => {
        var myHeaders = new Headers();
        console.log(token);
        myHeaders.append("Authorization", "Bearer " + token);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch("https://ep-app-server.onrender.com/profile", requestOptions)
            .then(response => response.json())
            .then(result => {
                setUserContext(result);
            })
            .catch(error => console.log('error', error));

    }

    const handleInputChange = async (text) => {
        setInputValue(text);
        var requestOptions = {
            method: 'GET',
        };
        const apiKey = 'ae0534df26a0484f9977c8dbadfc05e5';
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&format=json&filter=countrycode:vn&apiKey=${apiKey}`;
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                var arr = [];
                for (var i = 0; i < result.results.length; i++) {
                    let id = i + 1;
                    const prediction = {
                        id: id,
                        name: result.results[i].name,
                        lat: result.results[i].lat,
                        lon: result.results[i].lon,
                    };
                    arr.push(prediction);
                }
                setPredictions(arr);
            })
            .catch(error => console.log('error', error));
    };

    const getCurrentDateTime = () => {
        var currentdate = new Date();
        var datetime = currentdate.getDate() + '/' + (currentdate.getMonth() + 1) + '/' + currentdate.getFullYear()
            + ' ' + currentdate.getHours() + ':' + currentdate.getMinutes() + ':' + currentdate.getSeconds();
        console.log(datetime);
        return datetime;
    }

    const requestBooking = () => {
        var datetime = getCurrentDateTime();
        var requestBody = {
            'Parking': pData.nameParking,
            'User': userContext.idUser,
            'TimeBooking': datetime
        }
        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        };
        // const url = 'https://server-iot-myjn.onrender.com/app2/reservation';
        const url = `${process.env.LOCAL_IP_URL_BOOKING}/app2/reservation`;
        fetch(url, requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Yêu cầu thất bại.');
                }
            })
            .then(data => {
                setMessageType('Thành công');
                setMessage(`Yêu cầu đặt chỗ thành công tại ${parking}`);
                setModalVisible(true);
                setSlot(data.reservation);
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });
    }

    const requestSchedule = () => {
        var requestBody = {
            'Parking': pData.nameParking,
            'User': userContext.idUser,
            'date': date.toLocaleDateString(),
            'time': timeCheckout.toLocaleTimeString()
        }
        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        };
        const url = 'https://server-iot-myjn.onrender.com/app1/booking';
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
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });
    }

    const cancelBooking = () => {
        var requestBody = {
            'User': id,
        }
        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        };
        const url = 'https://server-iot-myjn.onrender.com/app3/cancel';
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
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });
    }

    const getRouteFromApi = () => {
        var requestOptions = {
            method: 'GET',
        };
        const apiKey = 'ae0534df26a0484f9977c8dbadfc05e5';
        const url = `https://api.geoapify.com/v1/routing?waypoints=${currentLatitude},${currentLongtitude}|${desLat},${desLng}&mode=drive&apiKey=ae0534df26a0484f9977c8dbadfc05e5`;
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                //setRoutes();
                const arrayOfCoordinates = result.features[0].geometry.coordinates[0].map(arr => {
                    return {
                        latitude: arr[1],
                        longitude: arr[0]
                    }
                })
                setRoutes(arrayOfCoordinates);
                console.log(routes);
                const newArr = result.features[0].properties.legs[0].steps.map(
                    obj => obj.instruction.text
                );
                setInstructionsArray(newArr);
                const distance = result.features[0].properties.distance / 1000;
                const duration = result.features[0].properties.time / 60;
                setDistance(distance.toFixed(2));
                setDuration(duration.toFixed(2));
                //Tts.speak(instructionsArray[0]);
            })
            .catch(error => console.log('error', error));
    }

    const callFromBackEnd = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch("https://ep-app-server.onrender.com/parking", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log(error));
    }

    useEffect(() => {
        const interval = setInterval(() => {
            console.log('Reupdate after 10 secs');
            console.log('user context: ', userContext);
            getUserInfo();
        }, 10000);
        return () => clearInterval(interval);
    }, [token]);

    useEffect(() => {
        const requestLocationPermission = async () => {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                );
                if (granted === PermissionsAndroid.RESULTS.granted) {
                    console.log('Permission Granted')
                } else {
                    console.log('Permission Denied')
                }
            } catch (err) {
                console.warn(err);
            }
        }
        requestLocationPermission();
    }, []);

    const getLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                console.log(position);
                setCurrentLatitude(position.coords.latitude);
                setCurrentLongtitude(position.coords.longitude);
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 2000, maximumAge: 10000 }
        )
    }

    if (chosen) {
        console.log(posLat);
        console.log(posLng);
        mapViewRef.current?.animateToRegion({
            latitude: posLat,
            longitude: posLng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }, 1000);
        setChosen(false);
    }

    useEffect(() => {
        callFromBackEnd();
        getLocation();
    }, []);

    return (
        <View style={{ marginTop: 0, flex: 1 }}>
            <MapView
                ref={mapViewRef}
                provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                style={styles.map}
                region={{
                    latitude: 21.10748167422885,
                    longitude: 105.96041236763716,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
            >

                {/*
                // Marker for current location 
                 */}
                <Marker
                    title='Bạn đang ở đây'
                    pinColor='white'
                    coordinate={{ latitude: currentLatitude, longitude: currentLongtitude }}
                    image={require('./img/my-location.png')}
                ></Marker>
                <Circle
                    center={{ latitude: currentLatitude, longitude: currentLongtitude }}
                    radius={1000}
                    strokeColor='#7eb6ff'
                    strokeWidth={2}
                >
                </Circle>

                {/*
                // Marker for found place 
                 */}
                {
                    showMarker && (
                        <Marker
                            coordinate={{ latitude: posLat, longitude: posLng }}
                            image={require('./img/location.png')}
                        >
                        </Marker>
                    )
                }

                {/* Markers for parkings */}
                {data.map((item, index) => (
                    <Marker
                        key={index}
                        title={item.nameParking}
                        coordinate={{ latitude: item.latitude, longitude: item.longitude }}
                        onPress={() => {
                            setDesLat(item.latitude);
                            setDesLng(item.longitude);
                            setShow(true);
                            setSlot(null);
                            setPdata({
                                ...pData,
                                nameParking: item.nameParking,
                                address: item.address,
                                price: item.price,
                                slotLeft: item.Value_empty_slot
                            });
                        }}
                    >
                        <Image
                            source={require('./img/pin.png')}
                            style={{ width: 20, height: 30 }}
                            resizeMode="contain"
                        />
                    </Marker>
                ))}

                {/* Draw instructions to target place */}
                {showDirection && (
                    <Polyline
                        coordinates={routes}
                        strokeColor='#2957C2'
                        strokeWidth={5}
                    />
                )
                }
            </MapView>

            {/*
            // Places Autocompletes 
             */}
            <TouchableOpacity
                style={styles.searchBtn}
                onPress={() => {
                    setShowSearchInput(true);
                }}>
                <Icon name="search" size={20} color="white" />
            </TouchableOpacity>
            {
                showSearchInput && (
                    <View style={styles.dropdown}>
                        <View style={styles.searchBox}>
                            <Icon name="search" size={20} color="#2957C2" />
                            <TextInput
                                placeholder="Nhập vị trí bạn muốn đến"
                                keyboardType="default"
                                value={inputValue}
                                onChangeText={handleInputChange}
                                onPressIn={() => { setShowPredictions(true) }}
                                style={{ padding: 10, fontSize: 14, width: '90%' }}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => { setShowSearchInput(false) }}
                            style={{ padding: 10, alignItems: 'flex-end' }}
                        >
                            <Text style={{ color: '#2957C2' }}>Đóng</Text>
                        </TouchableOpacity>
                        {
                            showPredictions && (
                                <ScrollView>
                                    {predictions.map((item, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={styles.predictions}
                                            onPress={() => {
                                                setShowPredictions(false);
                                                setShowSearchInput(false);
                                                setShowMarker(true);
                                                setPosLat(item.lat);
                                                setPosLng(item.lon);
                                                setChosen(true);
                                            }}
                                        >
                                            <Text key={index}>{item.name}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            )
                        }
                    </View>

                )
            }

            {/* Current location button */}
            <TouchableOpacity
                style={styles.locationBtn}
                onPress={() => {
                    mapViewRef.current?.animateToRegion({
                        latitude: currentLatitude,
                        longitude: currentLongtitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }, 1000);
                    console.log('Tapped')
                }}>
                <Icon name="location-arrow" size={20} color="white" />
            </TouchableOpacity>

            {/* Callout for parkings' markers */}
            {show && (
                <View style={styles.marker_callout}>
                    <Text style={styles.textCentered}>Thông tin</Text>
                    <Image
                        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Tel_Aviv_parking_lot.jpg' }}
                        resizeMode='cover'
                        style={styles.parkingImage}
                    />
                    <DynamicText
                        text={pData.nameParking}
                    />
                    <Text>{pData.address}</Text>
                    <View style={styles.price}>
                        <Text style={styles.textPurple}>{pData.price}</Text>
                        <Text>Mỗi giờ</Text>
                    </View>
                    <View style={{ display: 'flex', flexDirection: 'row', gap: 12, justifyContent: 'center' }}>
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => {
                                setShow(false);
                            }}
                        >
                            <Text style={{ color: '#4448AE', fontWeight: 'bold' }}>Đóng</Text>
                        </TouchableOpacity>
                        <LinearGradient
                            colors={['#CEC9F2', '#B1B1F1', '#9C9FF0']}
                            style={styles.cancelBtn}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    setBooking(true);
                                    setShow(false);
                                }}
                                style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                                    Chi tiết</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>
            )
            }

            <Modal
                animationType='fade'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.textDark}>{messageType}</Text>
                        <Text style={styles.textDarkRegular}>{message}</Text>
                        <LinearGradient
                            colors={['#CEC9F2', '#B1B1F1', '#9C9FF0']}
                            style={styles.closeBtn}
                        >
                            <TouchableOpacity
                                onPress={() => setModalVisible(!modalVisible)}
                                style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Text style={styles.textLight}>
                                    Đóng</Text>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>
            </Modal>

            {/* Booking Details */}
            {
                booking && (
                    <View style={styles.bookingDetails}>
                        <View style={styles.bookingDetails}>
                            <View style={{ display: 'flex', flexDirection: 'row', gap: 16, alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => {
                                    setBooking(false);
                                }}>
                                    <Icon name="long-arrow-left" size={25} color="#4448AE" />
                                </TouchableOpacity>
                                <Text style={{ ...styles.textPurple, color: '#212121' }}>Thông tin đặt chỗ</Text>
                            </View>
                            <Text style={{ ...styles.textPurple, fontSize: 20, color: '#212121' }}>Lựa chọn ngày</Text>
                            <View style={styles.dateTime}>
                                <Text style={styles.dateTimeText}>{date.toLocaleDateString()}</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        setOpenDatePicker(true);
                                    }}
                                >
                                    <Text style={{ color: '#212121', alignSelf: 'flex-end' }} >Chọn</Text>
                                </TouchableOpacity>
                            </View>
                            <DatePicker
                                modal
                                mode="date"
                                open={openDatePicker}
                                date={date}
                                onConfirm={(date) => {
                                    setOpenDatePicker(false)
                                    setDate(date)
                                    console.log(date.toLocaleDateString())
                                }}
                                onCancel={() => {
                                    setOpenDatePicker(false);
                                }}
                            />
                            <View style={styles.timePicker}>
                                <View style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <Text style={{ ...styles.textPurple, fontSize: 16, color: '#212121' }}>Giờ bắt đầu</Text>
                                    <View style={{ ...styles.dateTime, width: 'auto' }}>
                                        <Text style={styles.dateTimeText}>{timeCheckin.toLocaleTimeString()}</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setOpenTimeInPicker(true);
                                            }}
                                        >
                                            <Text style={{ color: '#2957c2' }} >Chọn</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <DatePicker
                                        modal
                                        mode="time"
                                        open={openTimeInPicker}
                                        date={timeCheckin}
                                        onConfirm={(timeCheckin) => {
                                            setOpenTimeInPicker(false)
                                            setTimeCheckin(timeCheckin)
                                            console.log(timeCheckin.toLocaleTimeString())
                                        }}
                                        onCancel={() => {
                                            setOpenTimeInPicker(false)
                                        }}
                                    />
                                </View>
                                <View style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                    <Text style={{ ...styles.textPurple, fontSize: 16, color: '#212121' }}>Giờ kết thúc</Text>
                                    <View style={{ ...styles.dateTime, width: 'auto' }}>
                                        <Text style={styles.dateTimeText}>{timeCheckout.toLocaleTimeString()}</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setOpenTimeOutPicker(true);
                                            }}
                                        >
                                            <Text style={{ color: '#2957c2' }}>Chọn</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <DatePicker
                                        modal
                                        mode="time"
                                        open={openTimeOutPicker}
                                        date={timeCheckout}
                                        onConfirm={(timeCheckout) => {
                                            setOpenTimeOutPicker(false)
                                            setTimeCheckout(timeCheckout)
                                            console.log(timeCheckout.toLocaleDateString())
                                        }}
                                        onCancel={() => {
                                            setOpenTimeOutPicker(false)
                                        }}
                                    />
                                </View>
                            </View>
                            <Text style={{ ...styles.textPurple, fontSize: 16, color: '#212121' }}>Tổng tiền</Text>
                            <Text style={styles.textPurple}>20000 / 4 Tiếng</Text>
                            <View style={{ display: 'flex', flexDirection: 'row', gap: 12, justifyContent: 'center' }}>
                                <TouchableOpacity
                                    style={styles.cancelBtn}
                                    onPress={() => {
                                        getCurrentDateTime();
                                        setParking(pData.nameParking);
                                        requestBooking();
                                        setBooking(false);
                                    }}
                                >
                                    <Text style={{ color: '#4448AE', fontWeight: 'bold' }}>Đặt ngay</Text>
                                </TouchableOpacity>
                                <LinearGradient
                                    colors={['#CEC9F2', '#B1B1F1', '#9C9FF0']}
                                    style={styles.cancelBtn}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            requestSchedule();
                                            setParking(pData.nameParking);
                                            setBooking(false);
                                        }}
                                        style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        <Text style={{ color: '#FFF', fontWeight: 'bold' }}>
                                            Lên lịch</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </View>
                        </View>
                    </View>
                )
            }


            {/* Display current parking'status */}
            {
                showParkingStatus && (
                    <View style={styles.bookingStatusContainer}>
                        <Text style={{ fontSize: 14, color: '#000' }}>Bạn đang đặt chỗ ở {parking} </Text>
                        <Text style={{ fontSize: 14, color: '#000' }}>Vị trí đỗ: Ô {slot}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                cancelBooking();
                                setBooking(false);
                                setUserStatus(false);
                                setShowParkingStatus(false);
                                setParking(null);
                            }}
                        >
                            <Text style={{ color: '#2957C2' }}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                )
            }

            {/* Text Instructions */}
            {
                showRoutes && (
                    <View style={styles.navigationContainer}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                            <Text style={{ fontSize: 14, color: '#000' }}>Đang điều hướng đến vị trí ...</Text>
                            <TouchableOpacity
                                style={{ position: 'absolute', right: 10 }}
                                onPress={() => {
                                    setShowRoutes(false);
                                    setShowDirection(false);
                                    setCurrentIndex(0);
                                }}
                            >
                                <Icon name="close" size={25} color="#2957C2" />
                            </TouchableOpacity>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: 5 }}>
                            <Icon name="road" size={16} color="#2957C2" />
                            <Text style={{ marginRight: 10 }}>{distance} km</Text>
                            <Icon name="clock-o" size={16} color="#2957C2" />
                            <Text>{duration} phút</Text>
                        </View>
                        <View style={{ height: 70, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#000', fontSize: 14 }}>{instructionsArray[currentIndex]}</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setCurrentIndex(currentIndex - 1);
                                }}
                                style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Text style={{ color: '#2957C2' }}>Trở lại</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    if (currentIndex < instructionsArray.length - 1) {
                                        setCurrentIndex(currentIndex + 1);
                                        console.log(routes[currentIndex].latitude)
                                        /*   mapViewRef.current?.animateToRegion({
                                             latitude: routes[currentIndex].latitude,
                                             longitude: routes[currentIndex].longitude,
                                             latitudeDelta: 0.01,
                                             longitudeDelta: 0.01,
                                         }, 1000); */
                                        Tts.speak(instructionsArray[currentIndex + 1]);
                                    }
                                }}
                                style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Text style={{ color: '#2957C2' }}>Tiếp theo</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    infoContainer: {
        position: 'absolute',
        width: '100%',
        height: 200,
    },
    dropdown: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 1,
        backgroundColor: '#fff',
        padding: 24,
    },
    searchBox: {
        paddingLeft: 20,
        display: 'flex',
        flexDirection: 'row',
        gap: 12,
        borderWidth: 1,
        borderColor: '#4448AE',
        borderRadius: 10,
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    btn: {
        position: 'absolute',
        width: '60%',
        height: 40,
        backgroundColor: '#87ceeb',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        shadowColor: 'black',
        shadowOpacity: 4,
        bottom: 40,
        left: 80
    },
    searchBtn: {
        position: 'absolute',
        width: 52,
        height: 52,
        backgroundColor: '#4448AE',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        shadowColor: 'black',
        shadowOpacity: 4,
        top: 20,
        right: 20,
    },
    locationBtn: {
        position: 'absolute',
        width: 52,
        height: 52,
        backgroundColor: '#4448AE',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        shadowColor: 'black',
        shadowOpacity: 4,
        bottom: 50,
        right: 20,
    },
    cancelBtn: {
        width: '45%',
        height: 58,
        backgroundColor: '#F1F2FF',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#4448AE',
        marginTop: 10,
        borderRadius: 10,
    },
    bookingDetails: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        padding: 10,
    },
    dateTime: {
        backgroundColor: '#FAFAFA',
        display: 'flex',
        flexDirection: 'row',
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        fontWeight: 'bold',
        gap: 12,
        padding: 16,
    },
    timePicker: {
        display: 'flex', flexDirection: 'row', gap: 40, justifyContent: 'center'
    },
    dateTimeText: {
        fontWeight: '500',
        fontSize: 14,
        color: '#212121',
    },
    price: {
        width: '100%',
        height: 'auto',
        backgroundColor: '#F1F2FF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        marginTop: 10,
    },
    text1: {
        color: 'white',
        fontSize: 18,
    },
    textCentered: {
        alignSelf: 'center',
        color: '#212121',
        fontWeight: 'bold',
        fontSize: 21,
    },
    textPurple: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4448AE'
    },
    parkingImage: {
        width: '100%',
        height: 182,
        borderRadius: 10,
        marginVertical: 24,
    },
    marker_callout: {
        backgroundColor: '#fff',
        position: 'absolute',
        width: '100%',
        height: 'auto',
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: 30,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    predictions: {
        height: 55,
        padding: 10,
        color: '#000'
    },
    scheduleBooking: {
        display: 'flex',
        flexDirection: 'row',
        height: 28,
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
        marginBottom: 24
    },
    navigationContainer: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: '90%',
        height: 'auto',
        borderColor: '#000',
        borderWidth: 1,
        top: 20,
        left: 20,
        display: 'flex',
        padding: 10
    },
    bookingStatusContainer: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: '90%',
        height: 'auto',
        borderColor: '#000',
        borderWidth: 1,
        top: 80,
        left: 20,
        display: 'flex',
        padding: 10
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
    closeBtn: {
        width: '100%',
        height: 48,
        borderRadius: 10,
    },
    textLight: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontFamily: 'Urbanist-Regular'
    },
    textDark: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#212121',
        fontFamily: 'Urbanist-Regular'
    },
    textDarkRegular: {
        fontSize: 16,
        color: '#212121',
        fontFamily: 'Urbanist-Regular'
    },
    textSmall: {
        fontSize: 14,
        color: '#212121'
    },

});

export default MapScreen;