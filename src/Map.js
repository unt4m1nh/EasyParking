import React, { Fragment, useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    PermissionsAndroid,
    Button,
    ScrollView,
} from 'react-native'

import MapView, { LatLng, Callout, Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import SearchableDropdown from 'react-native-searchable-dropdown';

import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import data from '../backend/data.json';
import listPos from './data/testPosition.json'

import CardInfo from './CardInfo';

var list = [
    {
        "id": 1,
        "name": "Vinhomes Royal City",
        "address": "72 Nguyễn Trãi, Thượng Đình, Thanh Xuân, Hà Nội",
        "longitude": 105.81622312517251,
        "latitude": 21.001677603066064
    },
    {
        "id": 2,
        "name": "Indochina Plaza Hanoi",
        "address": "241 Xuân Thủy, Dịch Vọng Hậu, Cầu Giẩy, Hà Nội",
        "longitude": 105.78279335216159,
        "latitude": 21.035982012278232
    },
    {
        "id": 3,
        "name": "Hồ Hoàn Kiếm",
        "address": "Hàng Trống, Hoàn Kiếm, Hà Nội",
        "longitude": 105.8519248140914,
        "latitude": 21.028924944948137
    },
    {
        "id": 4,
        "name": "Vincom Center Phạm Ngọc Thạch",
        "address": "02 Phạm Ngọc Thạch, Kim Liên, Đống Đa, Hà Nội",
        "longitude": 105.83199891167854,
        "latitude": 21.006591538713227
    },
    {
        "id": 5,
        "name": "Bệnh viện Bạch Mai",
        "address": "Phương Mai, Đống Đa, Hà Nội",
        "longitude": 105.83919385216082,
        "latitude": 21.00297054946842
    }
]

function MapScreen({ navigation }) {
    const [currentLongtitude, setCurrentLongtitude] = useState(0);
    const [currentLatitude, setCurrentLatitude] = useState(0);
    const [desLat, setDesLat] = useState(0);
    const [desLng, setDesLng] = useState(0);
    const [showDirection, setShowDirection] = useState(false);
    const [show, setShow] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [posLat, setPosLat] = useState(null);
    const [posLng, setPosLng] = useState(null);

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
                        }}
                    >
                        <Callout>
                            <View>
                                <Text>Name: {item.nameParking}</Text>
                                <Text>{item.Value_empty_slot}</Text>
                            </View>
                        </Callout>
                    </Marker>
                ))}
                {showDirection && (
                    <MapViewDirections
                        origin={{
                            latitude: currentLatitude,
                            longitude: currentLongtitude,
                        }}
                        destination={{
                            latitude: desLat,
                            longitude: desLng,
                        }}
                        apikey={'AIzaSyCpIjvhZmuyzUkn_iJ-9eTLhPBrjyQFsMM'}
                        strokeWidth={3}
                        strokeColor="hotpink"
                    //onReady={traceRouteOnReady}
                    />
                )
                }
            </MapView>
            <View style={styles.dropdown}>
                <SearchableDropdown
                    onItemSelect={(item) => {
                        //setSelectedItem(item)

                        setPosLat(item.latitude);
                        setPosLng(item.longitude);
                        console.log(posLat);
                        console.log(posLng);
                        _map.animateToRegion({
                            latitude: posLat,
                            longitude: posLng,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }, 1000);

                    }}
                    containerStyle={{
                        position: 'absolute',
                        marginTop: 0,
                        alignItems: 'center',
                        width: '100%',
                        padding: 5,
                        backgroundColor: '#fff',
                    }}
                    onRemoveItem={(item, index) => {

                    }}
                    itemStyle={{
                        //position: 'absolute',
                        with: '100%',
                        padding: 10,
                        marginTop: 2,
                        backgroundColor: '#ddd',
                        borderColor: '#bbb',
                        borderWidth: 1,
                        borderRadius: 5,
                    }}
                    itemTextStyle={{ color: '#222' }}
                    itemsContainerStyle={{
                        top: 50,
                        width: "100%",
                        maxHeight: 700
                    }}
                    items={list}
                    resetValue={false}
                    textInputProps={
                        {
                            placeholder: "Nhập vị trí bạn muốn đến ",
                            underlineColorAndroid: "transparent",
                            style: {
                                position: 'absolute',
                                width: "100%",
                                padding: 12,
                                borderWidth: 1,
                                borderColor: '#ccc',
                                borderRadius: 5,
                            },
                            //onTextChange: text => alert(text)
                        }
                    }
                    listProps={
                        {
                            nestedScrollEnabled: true,
                        }
                    }
                />
            </View>
            {show && (
                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => {
                        setShowDirection(true);
                    }}>
                    <Text style={styles.text1}>Trace Route</Text>
                </TouchableOpacity>
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
                <Text style={styles.text1}>+</Text>
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
        height: 55,
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
        backgroundColor: '#87ceeb',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        shadowColor: 'black',
        shadowOpacity: 4,
        bottom: 40,
        right: 20,
    },
    text1: {
        color: 'white',
        fontSize: 20,
    },
});

export default MapScreen;