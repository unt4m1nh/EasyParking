import React, { Fragment, useEffect, useState } from 'react';
import {
    Text,
    TextInput,
    FlatList,
    View,
    StyleSheet,
    TouchableOpacity,
    PermissionsAndroid,
    Button,
    ScrollView,
} from 'react-native'

import MapView, { Polyline, Callout, Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import SearchableDropdown from 'react-native-searchable-dropdown';

import Icon from 'react-native-vector-icons/FontAwesome'

import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import data from '../backend/data.json';

function MapScreen({ navigation }) {
    const [currentLongtitude, setCurrentLongtitude] = useState(0);
    const [currentLatitude, setCurrentLatitude] = useState(0);
    const [desLat, setDesLat] = useState(0);
    const [desLng, setDesLng] = useState(0);
    const [showDirection, setShowDirection] = useState(false);
    const [show, setShow] = useState(false);
    const [routes, setRoutes] = useState([]);
    const [posLat, setPosLat] = useState(null);
    const [posLng, setPosLng] = useState(null);
    const [pData, setPdata] = React.useState({
        nameParking: '',
        status: '',
        price: '',
        slotLeft: '',
    })
    const [inputValue, setInputValue] = useState('');
    const [predictions, setPredictions] = useState([]);
    const [showPredictions, setShowPredictions] = useState(false);
    const [showMarker, setShowMarker] = useState(false);
    const [chosen, setChosen] = useState(false);

    const handleInputChange = async (text) => {
        setInputValue(text);
        var requestOptions = {
            method: 'GET',
        };
        const apiKey = 'ae0534df26a0484f9977c8dbadfc05e5';
        const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${text}&format=json&apiKey=${apiKey}`;
        console.log(url);
        fetch(url, requestOptions)
            .then(response => response.json())
            .then(result => {
                var arr = [];
                for (var i = 0; i < 5; i++) {
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

    const getRouteFromApi = () => {
        var requestOptions = {
            method: 'GET',
        };
        const apiKey = 'ae0534df26a0484f9977c8dbadfc05e5';
        const url = `https://api.geoapify.com/v1/routing?waypoints=21.02927009995365,105.8560117698695|${desLat},${desLng}&mode=drive&apiKey=ae0534df26a0484f9977c8dbadfc05e5`;
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
            .catch(error => console.log('error', error));
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
        _map.animateToRegion({
            latitude: posLat,
            longitude: posLng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        }, 1000);
        setChosen(false);
    }


    getLocation();

    return (
        <View style={{ marginTop: 0, flex: 1 }}>
            <MapView
                ref={component => this._map = component}
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
                    coordinate={{ latitude: currentLatitude, longitude: currentLongtitude }}
                    image={require('./img/location.png')}
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
                        image={require('./img/parking-sign.png')}
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
                <TextInput
                    placeholder="Nhập vị trí bạn muốn đến"
                    keyboardType="default"
                    value={inputValue}
                    onChangeText={handleInputChange}
                    onPressIn={() => { setShowPredictions(true) }}
                    style={{ padding: 10, fontSize: 16 }}
                />
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
                            setShowDirection(true);
                            getRouteFromApi();
                        }}
                    >
                        <Text style={{ color: "#fff", fontSize: 20 }}>Đặt chỗ ngay</Text>
                    </TouchableOpacity>
                </View>
            )
            }
            <TouchableOpacity
                style={styles.locationBtn}
                onPress={() => {
                    _map.animateToRegion({
                        latitude: currentLatitude,
                        longitude: currentLongtitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }, 1000);
                    console.log('Tapped')
                }}>
                <Icon name="location-arrow" size={20} color="white" />
            </TouchableOpacity>
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
        height: 'auto',
        top: 0,
        backgroundColor: '#fff'
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
        width: 200,
        height: 50,
        backgroundColor: '#2957C2',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10
    },
    text1: {
        color: 'white',
        fontSize: 20,
    },
    marker_callout: {
        backgroundColor: '#fff',
        position: 'absolute',
        width: '100%',
        height: 226,
        bottom: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: 30
    },
    predictions: {
        height: 55,
        padding: 10,
        color: '#000'
    }
});

export default MapScreen;