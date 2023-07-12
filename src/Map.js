import React, { useEffect, useState } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    PermissionsAndroid,
    Button,
    ScrollView,
} from 'react-native'

import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import Geolocation from 'react-native-geolocation-service';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import data from './data/data';

function MapScreen({ navigation }) {
    const [currentLongtitude, setCurrentLongtitude] = useState(0);
    const [currentLatitude, setCurrentLatitude] = useState(0);
    const [viewPlace, setViewPlace] = useState(false);

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
                console.log(currentLatitude);
                console.log(currentLongtitude);
            },
            (error) => {
                // See error code charts below.
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 2000, maximumAge: 10000 }
        )
    }

    getLocation();

    const renderPlacesInfo = () => {

    }

    return (
        <View style={{ marginTop: 0, flex: 1 }}>
            <GooglePlacesAutocomplete
                placeholder='Search'
                autoFocus={false}
                returnKeyType={'default'}
                fetchDetails={true}
                GooglePlacesSearchQuery={{
                    rankby: "distance"
                }}
                onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    console.log(data, details);
                }}
                query={{
                    key: 'AIzaSyA5MYKgm_x0o_M0RLltOH1KtlEWKzJJtE8',
                    language: 'vi',
                    components: 'country: vi',
                    type: 'establishment',
                    radius: 40000,
                    location: `${currentLatitude}, ${currentLongtitude}`
                }}
                styles={{
                    container: {flex: 0, position: 'absolute', width: '100%', zIndex: 1},
                    listView: {backgroundColor: 'white'}
                }}
            />
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
                ></Marker>
                <Circle
                    center={{ latitude: currentLatitude, longitude: currentLongtitude }}
                    radius={100}
                    strokeColor='#7eb6ff'
                    strokeWidth={2}
                >
                </Circle>
                {data.map((item, index) => (
                    <Marker key={index} title={item.name} coordinate={{ latitude: item.latitude, longitude: item.longtitude }} />
                ))}
            </MapView>
            <TouchableOpacity
                style={styles.btn}
                onPress={() => {
                    navigation.navigate('ParkingListView')
                }}>
                <Text style={styles.text1}>See List of Parking</Text>
            </TouchableOpacity>
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
            {
                viewPlace &&
                <View>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
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