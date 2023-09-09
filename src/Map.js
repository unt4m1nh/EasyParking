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

import MapView, { Polyline, Callout, Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome'
import Tts from 'react-native-tts';
import Geolocation from 'react-native-geolocation-service';
import data from '../backend/data.json';
import DatePicker from 'react-native-date-picker'

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

    const mapViewRef = useRef(null);

    //Date Picker variables
    const [inDate, setIndate] = useState(new Date())
    const [openPicker1, setOpenPicker1] = useState(false)
    const [outDate, setOutdate] = useState(new Date())
    const [openPicker2, setOpenPicker2] = useState(false)

    //Test position
    const testLocation = {
        latitude: 21.016814960367533,
        longitude: 105.81790203356712
    }

    //Test fit coordinates
    const coordinatesToFocus = [
        {
            latitude: 21.016814960367533,
            longitude: 105.81790203356712
        }
    ]

    //Fit screen values
    const edgePaddingValue = 70;
    const edgePadding = {
        top: edgePaddingValue,
        right: edgePaddingValue,
        bottom: edgePaddingValue,
        left: edgePaddingValue,
    }

    const dataR = {
        'Parking': 'G2_UET_VNU',
        'User': 'zzkwHTMd',
        'TimeBooking': '2023-08-20 14:30:00'
    };

    const testData2 = {
        'Parking': 'G2_UET_VNU',
        'User': 'zzkwHTMd',
        'date': inDate.toLocaleDateString(),
        'time': inDate.toLocaleTimeString()
    }

    const testData3 = {
        'User': 'zzkwHTMd',
    }

    //Functions
    Tts.setDefaultLanguage('vi-VN');
    Tts.setDefaultVoice('vi-VN-language');
    //Tts.voices().then(voices => console.log(voices));

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

    const requestBooking = () => {
        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataR)
        };
        const url = 'http://192.168.43.178:8080/reservation';
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

    const requestSchedule = () => {
        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData2)
        };
        const url = 'http://192.168.43.178:8080/booking';
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
        var requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testData2)
        };
        const url = 'http://192.168.43.178:8090/cancel';
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
        const url = `https://api.geoapify.com/v1/routing?waypoints=${testLocation.latitude},${testLocation.longitude}|${desLat},${desLng}&mode=drive&apiKey=ae0534df26a0484f9977c8dbadfc05e5`;
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
                setShowDirection(false);
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
                provider={PROVIDER_GOOGLE} // remove if not using Google Mapsa
                style={styles.map}
                region={{
                    latitude: 21.018072,
                    longitude: 105.829949,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }}
            >
                <Marker
                    title='Bạn đang ở đây'
                    pinColor='white'
                    //coordinate={{ latitude: currentLatitude, longitude: currentLongtitude }}
                    coordinate={{ latitude: testLocation.latitude, longitude: testLocation.longitude }}
                    image={require('./img/my-location.png')}
                ></Marker>
                <Circle
                    center={{ latitude: testLocation.latitude, longitude: testLocation.longitude }}
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
                            console.log(posLat);
                            console.log(posLng);
                            setPdata({
                                ...pData,
                                nameParking: item.nameParking,
                                price: item.price,
                                slotLeft: item.emptySlot
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
                        style={{ padding: 10, fontSize: 16, width: '90%' }}
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
                                <Text style={{ color: '#2957C2', fontWeight: 'bold' }}>Đóng</Text>
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
                        <Text style={{ color: "#000", fontSize: 25 }}>{pData.nameParking}</Text>
                        <TouchableOpacity
                            style={{ position: 'absolute', right: 10 }}
                            onPress={() => {
                                setShow(false);
                            }}
                        >
                            <Icon name="close" size={25} color="#2957C2" />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ color: "#000", fontSize: 13 }} >Đang hoạt động</Text>
                    <Text style={{ color: "#000", fontSize: 15, marginTop: 10 }}>{pData.price}VNĐ / 1 giờ</Text>
                    <Text style={{ color: "#000", fontSize: 15 }}>{pData.slotLeft} chỗ trống</Text>
                    <TouchableOpacity
                        style={styles.bookingBtn}
                        onPress={() => {
                            //setShowDirection(true);
                            //getRouteFromApi();
                            setBooking(true);
                            setShow(false);
                        }}
                    >
                        <Text style={{ color: "#fff", fontSize: 18, textTransform: 'uppercase' }}>Lựa chọn</Text>
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
                                <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold', marginTop: 24 }}>Hoàn thiện yêu cầu đặt chỗ</Text>
                                <Text style={{ fontSize: 16, color: '#000', marginTop: 12 }}>Biển số xe của bạn là gì</Text>
                                <TextInput
                                    style={styles.plateInput}
                                    placeholder='30A123.45'
                                ></TextInput>
                                <TouchableOpacity
                                    style={styles.bookingBtn}
                                    onPress={() => {
                                        requestBooking();
                                        setUserStatus(true);
                                    }}
                                >
                                    <Text style={{ color: '#FFF', textTransform: 'uppercase' }}>Đặt ngay</Text>
                                </TouchableOpacity>
                                <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold', marginTop: 24 }}>Đặt trước</Text>
                                <Text style={{ fontSize: 16, color: '#000', marginTop: 12 }}>Bạn sẽ đỗ xe trong bao lâu</Text>
                                <View style={styles.scheduleBooking}>
                                    <Text style={{color: '#000'}}>Từ</Text>
                                    <Text style={{fontWeight: 'bold', fontSize: 20}}>{inDate.toLocaleString()}</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setOpenPicker1(true);
                                        }}
                                    >
                                        <Text style={{color: '#2957c2', fontWeight: 'bold'}} >Chọn</Text>
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
                                    <Text style={{color: '#000'}}>Đến</Text>
                                    <Text style={{fontWeight: 'bold', fontSize: 20}}>{outDate.toLocaleString()}</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setOpenPicker2(true);
                                        }}
                                    >
                                        <Text style={{color: '#2957c2', fontWeight: 'bold'}}>Chọn</Text>
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
                                <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold', margin: 24 }}>Đặt chỗ thành công</Text>
                                <TouchableOpacity
                                    style={styles.bookingBtn}
                                    onPress={() => {
                                        cancelBooking();
                                        setBooking(false);
                                        setUserStatus(false);
                                    }}
                                >
                                    <Text style={{ color: '#FFF', textTransform: 'uppercase' }}>Hủy đặt chỗ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.bookingBtn}
                                    onPress={() => {
                                        setShowDirection(true);
                                        getRouteFromApi();
                                        setBooking(false);
                                        setUserStatus(false);
                                        setShowRoutes(true);
                                        mapViewRef.current?.fitToCoordinates([{ latitude: testLocation.latitude, longitude: testLocation.longitude }, { latitude: desLat, longitude: desLng },], {
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
                showRoutes && (
                    <View style={styles.navigationContainer}>
                        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                            <Text style={{ fontSize: 16, color: '#000', fontWeight: 'bold' }}>Đang điều hướng đến vị trí ...</Text>
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
                            <Text style={{ color: '#000', fontSize: 16 }}>{instructionsArray[currentIndex]}</Text>
                        </View>
                        <View style={{ display: 'flex', flexDirection: 'row' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setCurrentIndex(currentIndex - 1);
                                }}
                                style={{ width: '50%', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Text style={{ color: '#2957C2', fontWeight: 'bold' }}>Trở lại</Text>
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
                                <Text style={{ color: '#2957C2', fontWeight: 'bold' }}>Tiếp theo</Text>
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
        fontSize: 20,
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
    plateInput: {
        width: '90%',
        padding: 10,
        borderColor: '#000',
        borderWidth: 1,
        marginTop: 8,
        marginBottom: 24
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
    }
});

export default MapScreen;