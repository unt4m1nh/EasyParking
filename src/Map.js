import React, { useEffect, useState, useRef } from 'react';
import {
    Text,
    TextInput,
    View,
    StyleSheet,
    TouchableOpacity,
    PermissionsAndroid,
    ScrollView,
} from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Polyline, Callout, Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome'
import Tts from 'react-native-tts';
import Geolocation from 'react-native-geolocation-service';
import data from '../backend/data.json';
import DatePicker from 'react-native-date-picker'

import DynamicText from './DynamicText';

function MapScreen({ navigation }) {
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
    const [showPredictions, setShowPredictions] = useState(false);
    const [showMarker, setShowMarker] = useState(false);
    const [chosen, setChosen] = useState(false);
    const [booking, setBooking] = useState(false);
    const [userStatus, setUserStatus] = useState(false);
    const [showDirection, setShowDirection] = useState(false);
    const [show, setShow] = useState(false);
    const [showRoutes, setShowRoutes] = useState(false);
    const [showParkingStatus, setShowParkingStatus] = useState(false);

    const mapViewRef = useRef(null);

    //Date Picker variables
    const [inDate, setIndate] = useState(new Date())
    const [openPicker1, setOpenPicker1] = useState(false)
    const [outDate, setOutdate] = useState(new Date())
    const [openPicker2, setOpenPicker2] = useState(false)

    const [token, setToken] = useState(null);
    const [id, setUid] = useState(null);

    //Fit screen values
    const edgePaddingValue = 70;
    const edgePadding = {
        top: edgePaddingValue,
        right: edgePaddingValue,
        bottom: edgePaddingValue,
        left: edgePaddingValue,
    }

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

    const callUserID = () => {
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
                setUid(result.idUser);
                //setFdata({ ...fdata, name: uname, email: result.email, plate: result.plate, phoneNumber: result.phoneNumber })
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
        console.log(url);
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
            'User': id,
            'TimeBooking': datetime
        }
        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        };
        const url = 'https://server-iot-myjn.onrender.com/app2/reservation';
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
                setSlot(data.reservation);
            })
            .catch(error => {
                console.error('Lỗi:', error);
            });
    }

    const requestSchedule = () => {
        var requestBody = {
            'Parking': pData.nameParking,
            'User': id,
            'date': inDate.toLocaleDateString(),
            'time': inDate.toLocaleTimeString()
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

        fetch("http://10.0.3.2:3000/parking", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log(error));
    }

    callUserID();

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

    callFromBackEnd();
    getLocation();
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
                {
                    showMarker && (
                        <Marker
                            coordinate={{ latitude: posLat, longitude: posLng }}
                            image={require('./img/location.png')}
                        >
                        </Marker>
                    )
                }
                {data.map((item, index) => (
                    <Marker
                        key={index}
                        title={item.nameParking}
                        coordinate={{ latitude: item.latitude, longitude: item.longitude }}
                        image={require('./img/pin.png')}
                        onPress={() => {
                            setDesLat(item.latitude);
                            setDesLng(item.longitude);
                            setShow(true);
                            setSlot(null);
                            setPdata({
                                ...pData,
                                nameParking: item.nameParking,
                                price: item.price,
                                slotLeft: item.Value_empty_slot
                            });
                        }}
                    >
                        <Callout>
                            <Text>{item.nameParking}</Text>
                        </Callout>
                    </Marker>
                ))}
                {showDirection && (
                    <Polyline
                        coordinates={routes}
                        strokeColor='#2957C2'
                        strokeWidth={5}
                    />
                )
                }
            </MapView>

            <View style={styles.dropdown}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                        placeholder="Nhập vị trí bạn muốn đến"
                        keyboardType="default"
                        value={inputValue}
                        onChangeText={handleInputChange}
                        onPressIn={() => { setShowPredictions(true) }}
                        style={{ padding: 10, fontSize: 14, width: '90%' }}
                    />
                    <Icon name="search" size={20} color="#2957C2" />
                </View>
                {
                    showPredictions && (
                        <ScrollView>
                            {predictions.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.predictions}
                                    onPress={() => {
                                        setShowPredictions(false);
                                        setShowMarker(true);
                                        console.log(item);
                                        setPosLat(item.lat);
                                        setPosLng(item.lon);
                                        setChosen(true);
                                    }}
                                >
                                    <Text key={index}>{item.name}</Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                onPress={() => { setShowPredictions(false) }}
                                style={{ padding: 10, alignItems: 'flex-end' }}
                            >
                                <Text style={{ color: '#2957C2'}}>Đóng</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    )
                }
            </View>


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
            {show && (
                <View style={styles.marker_callout}>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <DynamicText
                            text={pData.nameParking}
                        />
                        <TouchableOpacity
                            style={{ position: 'absolute', right: 5 }}
                            onPress={() => {
                                setShow(false);
                            }}
                        >
                            <Icon name="close" size={25} color="#2957C2" />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ color: "#000", fontSize: 11 }} >Đang hoạt động</Text>
                    <Text style={{ color: "#000", fontSize: 13, marginTop: 10 }}>{pData.price}VNĐ / 1 giờ</Text>
                    <Text style={{ color: "#000", fontSize: 13 }}>{pData.slotLeft} chỗ trống</Text>
                    <TouchableOpacity
                        style={styles.bookingBtn}
                        onPress={() => {
                            setBooking(true);
                            setShow(false);
                        }}
                    >
                        <Text style={styles.text1}>Lựa chọn</Text>
                    </TouchableOpacity>
                </View>
            )
            }
            {
                booking && (
                    <View style={styles.bookingDetails}>
                        {!userStatus ? (
                            <View>
                                <TouchableOpacity onPress={() => {
                                    setBooking(false);
                                }}>
                                    <Icon name="long-arrow-left" size={25} color="#2957C2" />
                                </TouchableOpacity>
                                <Text style={{ fontSize: 14, color: '#000', marginTop: 24 }}>Hoàn thiện yêu cầu đặt chỗ tại</Text>
                                <Text style={{ fontSize: 16, color: '#000', marginTop: 8 }}>{pData.nameParking}</Text>
                                <TouchableOpacity
                                    style={styles.bookingBtn}
                                    onPress={() => {
                                        if (!parking) {
                                            getCurrentDateTime();
                                            setParking(pData.nameParking);
                                            requestBooking();
                                            setUserStatus(true);
                                        } else {
                                            alert('Bạn đang gửi xe nên không thể đặt chỗ')
                                        }
                                    }}
                                >
                                    <Text style={{ color: '#FFF', textTransform: 'uppercase' }}>Đặt ngay</Text>
                                </TouchableOpacity>
                                <Text style={{ fontSize: 14, color: '#000', marginTop: 24 }}>Đặt trước</Text>
                                <Text style={{ fontSize: 14, color: '#000', marginTop: 12 }}>Bạn sẽ đỗ xe trong bao lâu</Text>
                                <View style={styles.scheduleBooking}>
                                    <Text style={{ color: '#000' }}>Từ</Text>
                                    <Text style={{fontSize: 18 }}>{inDate.toLocaleString()}</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setOpenPicker1(true);
                                        }}
                                    >
                                        <Text style={{ color: '#2957c2'}} >Chọn</Text>
                                    </TouchableOpacity>
                                    <DatePicker
                                        modal
                                        open={openPicker1}
                                        date={inDate}
                                        onConfirm={(inDate) => {
                                            setOpenPicker1(false)
                                            setIndate(inDate)
                                            console.log(inDate.toLocaleTimeString())
                                        }}
                                        onCancel={() => {
                                            setOpenPicker1(false)
                                        }}
                                    />
                                </View>
                                <View style={styles.scheduleBooking}>
                                    <Text style={{ color: '#000' }}>Đến</Text>
                                    <Text style={{fontSize: 18 }}>{outDate.toLocaleString()}</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setOpenPicker2(true);
                                        }}
                                    >
                                        <Text style={{ color: '#2957c2'}}>Chọn</Text>
                                    </TouchableOpacity>
                                    <DatePicker
                                        modal
                                        open={openPicker2}
                                        date={outDate}
                                        onConfirm={(outDate) => {
                                            setOpenPicker2(false)
                                            setOutdate(outDate)
                                            console.log(outDate.toLocaleDateString())
                                        }}
                                        onCancel={() => {
                                            setOpenPicker2(false)
                                        }}
                                    />
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        setUserStatus(true);
                                        requestSchedule();
                                    }}
                                    style={styles.bookingBtn}
                                >
                                    <Text style={{ color: '#FFF', textTransform: 'uppercase' }}>Lên lịch</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={{ alignItems: 'center', padding: 30 }}>
                                <Icon name="check-circle" size={50} color='green' />
                                <Text style={{ fontSize: 14, color: '#000', marginTop: 24 }}>Đặt chỗ thành công</Text>
                                <Text style={{ fontSize: 14, color: '#000', }}>Vị trí đỗ xe của bạn là ô {slot}</Text>
                                <TouchableOpacity
                                    style={styles.bookingBtn}
                                    onPress={() => {
                                        cancelBooking();
                                        setBooking(false);
                                        setUserStatus(false);
                                        setParking(null);
                                    }}
                                >
                                    <Text style={{ color: '#FFF', textTransform: 'uppercase' }}>Hủy đặt chỗ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.bookingBtn}
                                    onPress={() => {
                                        getRouteFromApi();
                                        setBooking(false);
                                        setUserStatus(false);
                                        setShowDirection(true);
                                        setShowRoutes(true);
                                        setShowParkingStatus(true);
                                        mapViewRef.current?.fitToCoordinates([{ latitude: currentLatitude, longitude: currentLongtitude }, { latitude: desLat, longitude: desLng },], {
                                            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                                            animated: true,
                                        });
                                    }}
                                >
                                    <Text style={{ color: '#FFF', textTransform: 'uppercase' }}>Điều hướng tới bãi xe</Text>
                                </TouchableOpacity>
                            </View>

                        )}
                    </View>
                )
            }
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
            {
                showRoutes && (
                    <View style={styles.navigationContainer}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                            <Text style={{ fontSize: 14, color: '#000'}}>Đang điều hướng đến vị trí ...</Text>
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
                                <Text style={{ color: '#2957C2'}}>Trở lại</Text>
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
                                <Text style={{ color: '#2957C2'}}>Tiếp theo</Text>
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
        width: '90%',
        marginLeft: 20,
        height: 'auto',
        top: 20,
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 1
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
    locationBtn: {
        position: 'absolute',
        width: 40,
        height: 40,
        backgroundColor: '#2957C2',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        shadowColor: 'black',
        shadowOpacity: 4,
        bottom: 50,
        right: 20,
    },
    bookingBtn: {
        width: '100%',
        height: 50,
        backgroundColor: '#2957C2',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    bookingDetails: {
        position: 'absolute',
        top: 100,
        left: 20,
        width: '90%',
        height: 'auto',
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 1,
        display: 'flex',
        padding: 10
    },
    text1: {
        color: 'white',
        fontSize: 18,
    },
    marker_callout: {
        backgroundColor: '#fff',
        position: 'absolute',
        width: '90%',
        height: 226,
        bottom: 20,
        left: 20,
        display: 'flex',
        flexDirection: 'column',
        padding: 30,
        borderColor: '#000',
        borderWidth: 1
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
    }
});

export default MapScreen;